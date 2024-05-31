import { getAuthUserDetails } from "@/lib/queries";
import React from "react";
import MenuOptions from "./MenuOptions";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails();

  if (!user) {
    return null;
  }

  if (!user.agency) return;

  const details =
    type === "agency"
      ? user?.agency
      : user?.agency.subAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabelledAgency = user.agency.whiteLabel;
  if (!details) return;

  let SidebarLogo = user.agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelledAgency) {
    if (type === "subaccount") {
      SidebarLogo =
        user?.agency.subAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.agency.agencyLogo;
    }
  }

  const sidebarOptions =
    type === "agency"
      ? user.agency.SideBarOption || []
      : user.agency.subAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  const subAccount = user.agency.subAccount.filter((subAccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subAccount.id && permission.access
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sideBarOptions={sidebarOptions}
        sidebarLogo={SidebarLogo}
        user={user}
        subAccounts={subAccount}
      />
      <MenuOptions
        details={details}
        sidebarLogo={SidebarLogo}
        id={id}
        sideBarOptions={sidebarOptions}
        user={user}
        subAccounts={subAccount}
      />
    </>
  );
};

export default Sidebar;
