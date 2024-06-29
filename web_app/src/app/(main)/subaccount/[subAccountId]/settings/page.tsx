import SubAccountDetails from "@/components/forms/SubAccountDetails";
import UserDetails from "@/components/forms/UserDetails";
import BlurPage from "@/components/global/BlurPage";
import { db } from "@/lib/db";
import { getUserByEmailId } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import React from "react";

type Props = {
  params: {
    subAccountId: string;
  };
};

const page = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return;

  const userDetails = await getUserByEmailId(
    authUser.emailAddresses[0].emailAddress
  );

  if (!userDetails) return;

  const subAccount = await db.subAccount.findUnique({
    where: {
      id: params.subAccountId,
    },
  });
  if (!subAccount) return;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: subAccount.agencyId,
    },
    include: {
      subAccount: true,
    },
  });

  if (!agencyDetails) return;
  const subAccounts = agencyDetails.subAccount;

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="subaccount"
          id={params.subAccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  );
};

export default page;
