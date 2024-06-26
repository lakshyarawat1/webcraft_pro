import AgencyDetails from "@/components/forms/AgencyDetails";
import UserDetails from "@/components/forms/UserDetails";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import React from "react";

type Props = {
  params: { agencyId: string };
};

const page = async ({ params }: Props) => {
  const authUser = await currentUser();

  if (!authUser) return null;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  });

  if (!userDetails) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      subAccount: true,
    },
  });

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.subAccount;

  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails type="agency" id={params.agencyId} subAccounts={subAccounts} userData={userDetails} />
    </div>
  );
};

export default page;
