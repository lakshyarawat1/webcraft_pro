import AgencyDetails from "@/components/forms/AgencyDetails";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
}) => {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await getAuthUserDetails();

  console.log(user, agencyId, searchParams);

  if (agencyId) {
    return redirect(`/agency/${agencyId}`);
  }

  const authUser = await currentUser();

  return (
    <>
      <div className="flex justify-center items-center mt-4">
        <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
          <h1 className="text-4xl">Create an agency</h1>
          <AgencyDetails
            data={{
              companyEmail: authUser?.emailAddresses[0].emailAddress,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;


