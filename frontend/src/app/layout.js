import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/ui/themes";
import { Inter } from "next/font/google";

// CSS
import "./globals.css";

// Import Component
import Header from "@/components/views/header";
import Footer from "@/components/views/footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "SERV - AI Recipe Platform",
  description: "SERV - AI Recipe Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ClerkProvider appearance={{ theme: shadesOfPurple }}>
          <Header />

          <main className="min-h-screen">{children}</main>

          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
