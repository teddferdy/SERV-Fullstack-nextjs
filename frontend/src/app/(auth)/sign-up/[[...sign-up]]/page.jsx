import React from "react";
import { SignUp } from "@clerk/nextjs";
import AuthlayoutPage from "../../layout";

const SignUpPage = () => {
  return (
    <AuthlayoutPage>
      <SignUp />
    </AuthlayoutPage>
  );
};

export default SignUpPage;
