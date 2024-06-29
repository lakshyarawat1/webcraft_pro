"use client";
import React from "react";
import PipelineInfobar from "./PipelineInfobar";
import { Pipeline } from "@prisma/client";
import CreatePipelineForm from "@/components/forms/CreatePipelineForm"
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePipeline } from "@/lib/queries";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PipelineSettings = ({
  pipelineId,
  subAccountId,
  pipelines,
}: {
  pipelineId: string;
  subAccountId: string;
  pipelines: Pipeline[];
}) => {
  const router = useRouter();
  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    await deletePipeline(pipelineId);
                    //Challenge: Activity log
                    toast({
                      title: "Deleted",
                      description: "Pipeline is deleted",
                    });
                    router.replace(`/subaccount/${subAccountId}/pipelines`);
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Oppse!",
                      description: "Could Delete Pipeline",
                    });
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <CreatePipelineForm
          subAccountId={subAccountId}
          defaultData={pipelines.find((p) => p.id === pipelineId)}
        />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
