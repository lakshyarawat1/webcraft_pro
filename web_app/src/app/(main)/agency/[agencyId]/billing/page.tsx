import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import React from "react";
import PricingCard from "./_components/PricingCard";
import { addOnProducts, pricingCards } from "@/lib/constants";
import { add } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import clsx from "clsx";

type Props = {
  params: { agencyId: string };
};

const page = async ({ params }: Props) => {
  const agencySubscription = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    select: {
      customerId: true,
      Subscription: true,
    },
  });

  const currentPlanDetails = pricingCards.find(
    (c) => c.priceId === agencySubscription?.Subscription[0]?.priceId
  );

  const prices = {
    data: [0, 30, 100],
    };
    
    const allCharges = [
      {
        id: "1",
        description: "Purchase at Store A",
        date: "2023-06-15",
        status: "Paid",
        amount: "$50.00",
      },
      {
        id: "2",
        description: "Subscription to Service B",
        date: "2023-06-20",
        status: "Pending",
        amount: "$15.00",
      },
      {
        id: "3",
        description: "Online Order from Store C",
        date: "2023-06-25",
        status: "Failed",
        amount: "$100.00",
      },
      {
        id: "4",
        description: "Purchase at Store D",
        date: "2023-07-01",
        status: "Paid",
        amount: "$25.00",
      },
      {
        id: "5",
        description: "Subscription to Service E",
        date: "2023-07-05",
        status: "Pending",
        amount: "$10.00",
      },
      {
        id: "6",
        description: "Online Order from Store F",
        date: "2023-07-10",
        status: "Failed",
        amount: "$200.00",
      },
    ];

  return (
    <>
      <h1 className="text-4xl p-4">Billing</h1>
      <Separator className="mb-6" />
      <h2 className="text-2xl p-4">Current plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          agencyId={params.agencyId}
          planExists={false}
          prices={prices.data}
          customerId={agencySubscription?.customerId || ""}
          amt={
            agencySubscription?.Subscription[0]?.active === true
              ? currentPlanDetails?.price || "$0"
              : "$0"
          }
          buttonCta={
            agencySubscription?.Subscription[0]?.active === true
              ? "Change Plan"
              : "Get Started"
          }
          highlightTitle="Plan Options"
          hightlightDescription="Want to modify your plan ? You can do this here. If you have further questions, please contact us."
          description={
            agencySubscription?.Subscription[0]?.active === true
              ? currentPlanDetails?.description || "Lets get started!"
              : "Lets get started! Pick a plan that works best for you."
          }
          duration="/ month"
          features={
            agencySubscription?.Subscription[0]?.active === true
              ? currentPlanDetails?.features || []
              : currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === "Starter")
                  ?.features ||
                []
          }
          title={
            agencySubscription?.Subscription[0]?.active === true
              ? currentPlanDetails?.title || "Starter"
              : "Starter"
          }
        />
        {addOnProducts.map((addOn) => (
          <PricingCard
            agencyId={params.agencyId}
            key={addOn.id}
            planExists={agencySubscription?.Subscription[0]?.active === true}
            prices={prices.data}
            customerId={agencySubscription?.Subscription[0]?.customerId || ""}
            amt={"$120"}
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/ month"
            features={[]}
            title={"24/7 priority support"}
            highlightTitle="Get support now !"
            hightlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>
      <h2 className="text-2xl p-4">Payment History</h2>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={clsx("", {
                    "text-emerald-500": charge.status.toLowerCase() === "paid",
                    "text-orange-600":
                      charge.status.toLowerCase() === "pending",
                    "text-red-600": charge.status.toLowerCase() === "failed",
                  })}
                >
                  {charge.status.toUpperCase()}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default page;
