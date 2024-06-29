import BlurPage from "@/components/global/BlurPage";
import React from "react";

type Props = {};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <BlurPage>{children}</BlurPage>;
};

export default layout;
