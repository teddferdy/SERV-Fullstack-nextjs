import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No User found");
    return null;
  }

  if (!STRAPI_API_TOKEN) {
    console.error("❌ STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }

  const email = user.emailAddresses[0].emailAddress;

  // Check subscription
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  try {
    // 🔍 1. CHECK USER (pakai email, bukan clerkId)
    const query = new URLSearchParams({
      "filters[email][$eq]": email,
    });

    const res = await fetch(`${STRAPI_URL}/api/users?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi fetch error:", errorText);
      return null;
    }

    const data = await res.json();

    // normalize response
    let users = [];
    if (Array.isArray(data)) users = data;
    else if (Array.isArray(data.data)) users = data.data;

    // ✅ USER FOUND
    if (users.length > 0) {
      const existingUser = users[0];

      // update subscription kalau berubah
      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }

      return { ...existingUser, subscriptionTier };
    }

    // 🔑 2. GET ROLE
    const rolesRes = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    const rolesData = await rolesRes.json();
    const role = rolesData.roles.find((r) => r.type === "authenticated");

    if (!role) {
      console.error("❌ Authenticated role not found");
      return null;
    }

    // ➕ 3. CREATE USER
    const userData = {
      username: user.username || email.split("@")[0],
      email,
      password: `clerk_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      role: role.id,
      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
    };

    const createRes = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });

    // ⚠️ HANDLE DUPLICATE EMAIL (IMPORTANT)
    if (!createRes.ok) {
      const errorText = await createRes.text();

      if (errorText.includes("Email already taken")) {
        console.warn("⚠️ Email already exists, retrying fetch...");

        const retryRes = await fetch(
          `${STRAPI_URL}/api/users?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
          },
        );

        const retryData = await retryRes.json();

        let retryUsers = [];
        if (Array.isArray(retryData)) retryUsers = retryData;
        else if (Array.isArray(retryData.data)) retryUsers = retryData.data;

        return retryUsers[0] || null;
      }

      console.error("❌ Error creating user:", errorText);
      return null;
    }

    const newUser = await createRes.json();
    return newUser;
  } catch (error) {
    console.error("❌ Error in checkUser:", error.message);
    return null;
  }
};
