"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { pricingCards } from "@/lib/constants";
import { db } from "@/lib/db";
import { upsertSubscription } from "@/lib/queries";
import { generateRandomUUID } from "@/lib/utils";
import { useModal } from "@/providers/model-provider";
import { Plan } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  existingPlan: string;
  agencyId: string;
};

const getPlanCode = (plan: string) => {
  switch (plan) {
    case "Unlimited Saas":
      return "UNLIMITED_SAAS" as Plan;

    case "Basic":
      return "BASIC" as Plan;

    case "Starter":
      return "STARTER" as Plan;
  }
};

const SubscriptionForm = (props: Props) => {
  const [planTitle, setPlan] = useState<Plan>();

  const { setClose  } = useModal()

  const allPlansExceptExisting = pricingCards.filter(
    (plan) => plan.title !== props.existingPlan
  );

  return (
    <div>
      {allPlansExceptExisting.map((plan) => (
        <Card
          key={plan.priceId}
          className="m-4 border-[1px] hover:border-primary"
          onClick={async () => {
            setPlan(getPlanCode(plan.title));
            try {
              console.log(plan)
              await upsertSubscription(props.agencyId, plan, planTitle);
              toast({
                title: "Success",
                description: "Plan changed successfully",
              });
              setClose();
            } catch (e) {
              toast({
                title: "Error",
                description: "Failed to change plan",
                variant: "destructive",
              });
              console.error(e);
            }
          }}
        >
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{plan.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionForm;
