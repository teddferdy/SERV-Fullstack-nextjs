import React from "react";
import { SignIn } from "@clerk/nextjs";
import AuthlayoutPage from "../../layout";

const SignInPage = () => {
  return (
    <AuthlayoutPage>
      <SignIn />
    </AuthlayoutPage>
  );
};

export default SignInPage;
