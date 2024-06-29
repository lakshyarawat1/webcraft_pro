import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { generateRandomUUID } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    subAccountId: string;
  };
};

const page = async ({ params }: Props) => {
  const pipelineExists = await db.pipeline.findFirst({
    where: {
      subAccountId: params.subAccountId,
    },
  });

  if (pipelineExists) {
    return redirect(
      `/subaccount/${params.subAccountId}/pipelines/${pipelineExists.id}`
    );
  }

  try {
    const res = await db.pipeline.create({
      data: {
        id: generateRandomUUID(),
        name: "First pipeline",
        subAccountId: params.subAccountId,
      },
    });

    return redirect(`/subacccount/${params.subAccountId}/pipeline/${res.id}`);
  } catch (err) {
    console.log(err);
    toast({
      variant: "destructive",
      title: "Failed",
      description:
        "Oops! Something went wrong while creating your first pipeline.",
    });
  }

  return <div>page</div>;
};

export default page;
