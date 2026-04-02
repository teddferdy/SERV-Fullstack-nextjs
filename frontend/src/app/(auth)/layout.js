import React from "react";

const AuthlayoutPage = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden pt-8">
      {children}
    </div>
  );
};

export default AuthlayoutPage;
