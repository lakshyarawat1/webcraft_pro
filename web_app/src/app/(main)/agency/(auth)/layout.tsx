import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full items-center justify-center flex">{children}</div>
  );
};

export default AuthLayout;
