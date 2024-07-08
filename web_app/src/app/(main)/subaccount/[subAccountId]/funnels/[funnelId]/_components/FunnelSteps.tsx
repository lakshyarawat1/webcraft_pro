"use client";

import CreateFunnelPage from "@/components/forms/CreateFunnelPage";
import CustomModal from "@/components/global/CustomModal";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { upsertFunnelPage } from "@/lib/queries";
import { useModal } from "@/providers/model-provider";
import { Funnel, FunnelPage } from "@prisma/client";
import { Check, ExternalLink, LucideEdit } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import FunnelStepsCard from "./FunnelStepsCard";

type Props = {
  funnel: Funnel;
  subAccountId: string;
  pages: FunnelPage[];
  funnelId: string;
};

const FunnelSteps = (props: Props) => {
  const [clickPage, setClickPage] = useState<FunnelPage | undefined>(
    props.pages[0]
  );
  const [pagesState, setPagesState] = useState(props.pages);

  const { setOpen } = useModal();

  const onDragStart = (event: DragStart) => {
    const { draggableId } = event;
    const value = pagesState.find((page) => page.id === draggableId);
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx };
      });

    setPagesState(newPageOrder);
    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertFunnelPage(
          props.subAccountId,
          {
            id: page.id,
            order: index,
            name: page.name,
          },
          props.funnelId
        );
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Could not save page order",
        });
        return;
      }
    });
  };

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col">
        <aside className="flex-[0.3] bg-background p-6 flex flex-col justify-between">
          {" "}
          <ScrollArea className="h-full ">
            <div className="flex gap-4 items-center">
              <Check />
              Funnel Steps
            </div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable
                  droppableId="funnels"
                  direction="vertical"
                  key="funnels"
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div
                          className="relative"
                          key={page.id}
                          onClick={() => setClickPage(page)}
                        >
                          <FunnelStepsCard
                            funnelPage={page}
                            index={idx}
                            key={page.id}
                            activePage={page.id === clickPage?.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No Pages
              </div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setOpen(
                <CustomModal
                  title="Create or update a funnel page."
                  subHeading="Funnel page allows you to create step by step processes for customer to follow"
                >
                  <CreateFunnelPage
                    subAccountId={props.subAccountId}
                    funnelId={props.funnelId}
                    order={pagesState.length}
                  />
                </CustomModal>
              );
            }}
          >
            Create new steps
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4">
          {!!props.pages.length ? (
            <Card className="h-full flex justify-between flex-col">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                    <Link
                      href={`/subaccount/${props.subAccountId}/funnels/${props.funnelId}/editor/${clickPage?.id}`}
                      className="relative group"
                    >
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transofrm -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                      />
                    </Link>

                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${props.funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickPage?.pathName}`}
                      className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden overflow-ellipsis ">
                        {process.env.NEXT_PUBLIC_SCHEME}
                        {props.funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                        {clickPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <CreateFunnelPage
                    subAccountId={props.subAccountId}
                    defaultData={clickPage}
                    funnelId={props.funnelId}
                    order={clickPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  );
};

export default FunnelSteps;
