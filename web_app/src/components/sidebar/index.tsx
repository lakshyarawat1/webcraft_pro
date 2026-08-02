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

  // ⚡ Bolt Optimization: Cache the active subAccount to avoid O(N) array search 3 separate times
  const currentSubAccount = type === "subaccount"
    ? user.agency.subAccount.find((subaccount) => subaccount.id === id)
    : null;

  const details = type === "agency" ? user?.agency : currentSubAccount;

  const isWhiteLabelledAgency = user.agency.whiteLabel;
  if (!details) return;

  let SidebarLogo = user.agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelledAgency) {
    if (type === "subaccount" && currentSubAccount) {
      SidebarLogo = currentSubAccount.subAccountLogo || user.agency.agencyLogo;
    }
  }

  const sidebarOptions =
    type === "agency"
      ? user.agency.SideBarOption || []
      : currentSubAccount?.SidebarOption || [];

  // ⚡ Bolt Optimization: Replace O(N*M) nested loop (filter + find) with O(N+M) Set lookup
  const permissionMap = new Set(
    user.Permissions.filter((p) => p.access).map((p) => p.subAccountId)
  );

  const subAccount = user.agency.subAccount.filter((subAcc) =>
    permissionMap.has(subAcc.id)
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
