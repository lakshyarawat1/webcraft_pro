import { getFunnels } from "@/lib/queries";
import React from "react";
import FunnelsDataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import FunnelForm from "@/components/forms/FunnelForm";
import BlurPage from "@/components/global/BlurPage";

const Funnels = async ({ params }: { params: { subAccountId: string } }) => {
  const funnels = await getFunnels(params.subAccountId);
  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subAccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default Funnels;
