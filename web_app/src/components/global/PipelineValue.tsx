"use client";
import { getPipelines } from "@/lib/queries";
import { Prisma } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  subaccountId: string;
};

const PipelineValue = ({ subaccountId }: Props) => {
  const [pipelines, setPipelines] = useState<
    Prisma.PromiseReturnType<typeof getPipelines>
  >([]);

  const [selectedPipelineId, setselectedPipelineId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPipelines(subaccountId);
      setPipelines(res);
      setselectedPipelineId(res[0]?.id);
    };
    fetchData();
  }, [subaccountId]);

  // ⚡ Bolt Optimization: Compute total and closed pipeline values in a single pass within useMemo.
  // This removes a React performance anti-pattern where a state setter was called during render,
  // preventing immediate unnecessary re-renders.
  const pipelineInfo = useMemo(() => {
    if (pipelines.length) {
      const pipeline = pipelines.find((pipeline) => pipeline.id === selectedPipelineId);
      if (pipeline && pipeline.Lane) {
        let totalValue = 0;
        let closedValue = 0;

        pipeline.Lane.forEach((lane, currentLaneIndex, array) => {
          const laneTicketsTotal = lane.Tickets.reduce(
            (totalTickets, ticket) => totalTickets + Number(ticket?.value),
            0
          );

          if (currentLaneIndex === array.length - 1) {
            closedValue = laneTicketsTotal || 0;
          } else {
            totalValue += laneTicketsTotal;
          }
        });

        return { totalPipelineValue: totalValue, pipelineClosedValue: closedValue };
      }
    }
    return { totalPipelineValue: 0, pipelineClosedValue: 0 };
  }, [selectedPipelineId, pipelines]);

  const { totalPipelineValue, pipelineClosedValue } = pipelineInfo;

  const pipelineRate = useMemo(
    () => {
      if (totalPipelineValue + pipelineClosedValue === 0) return 0;
      return (pipelineClosedValue / (totalPipelineValue + pipelineClosedValue)) * 100;
    },
    [pipelineClosedValue, totalPipelineValue]
  );

  return (
    <Card className="relative w-full xl:w-[350px]">
      <CardHeader>
        <CardDescription>Pipeline Value</CardDescription>
        <small className="text-xs text-muted-foreground">
          Pipeline Progress
        </small>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Closed ${pipelineClosedValue}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Total ${totalPipelineValue + pipelineClosedValue}
            </p>
          </div>
        </div>
        <Progress color="green" value={pipelineRate} className="h-2" />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="mb-2">
          Total value of all tickets in the given pipeline except the last lane.
          Your last lane is considered your closing lane in every pipeline.
        </p>
        <Select
          value={selectedPipelineId}
          onValueChange={setselectedPipelineId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a pipeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pipelines</SelectLabel>
              {pipelines.map((pipeline) => (
                <SelectItem value={pipeline.id} key={pipeline.id}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default PipelineValue;
