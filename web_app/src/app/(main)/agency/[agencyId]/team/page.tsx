import AgencyDetails from "@/components/forms/AgencyDetails";
import { db } from "@/lib/db";
import React from "react";
import DataTable from "./DataTable";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs";
import { columns } from "./Columns";
import SendInvitation from "@/components/forms/SendInvitations";

type Props = {
  params: {
    agencyId: string;
  };
};

const page = async ({ params }: Props) => {
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: {
      agency: {
        id: params.agencyId,
      },
    },
    include: {
      agency: {
        include: {
          subAccount: true,
        },
      },
      Permissions: {
        include: {
          subAccount: true,
        },
      },
    },
  });


  if (!authUser) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      subAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    ></DataTable>
  );
};

export default page;
