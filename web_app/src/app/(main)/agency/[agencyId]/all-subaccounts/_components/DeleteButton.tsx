'use client'

import {
  deleteSubAccount,
  getSubAccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  subAccountId: string;
};

const DeleteButton = ({ subAccountId }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        const res = await getSubAccountDetails(subAccountId);
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subAccount !' |  ${res?.name}`,
          subAccountId,
        });

              await deleteSubAccount(subAccountId);
              router.refresh()
      }}
    >
      Delete Sub Account
    </div>
  );
};

export default DeleteButton;
