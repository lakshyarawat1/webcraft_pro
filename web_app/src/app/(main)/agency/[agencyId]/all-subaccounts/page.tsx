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
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAuthUserDetails } from "@/lib/queries";
import { SubAccount } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeleteButton from "./_components/DeleteButton";

type Props = {
  params: {
    agencyId: string;
  };
};

const page = async ({ params }: Props) => {
  const user = await getAuthUserDetails();

  if (!user) return;

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <Button>Create</Button>
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Accounts" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.agency?.subAccount.length
                ? user.agency.subAccount.map((subaccount: SubAccount) => (
                    <CommandItem
                      key={subaccount.id}
                      className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                    >
                      <Link
                        href={`/subaccount/${subaccount.id}`}
                        className="flex gap-4 w-full h-full"
                      >
                        <div className="relative w-32">
                          <Image
                            src={subaccount.subAccountLogo}
                            alt="SubAccount Logo"
                            fill
                            className="rounded-md object-contain bg-muted/50"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-col">
                            {subaccount.name}
                            <span className="text-muted-foreground text-xs">
                              {subaccount.address}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <AlertDialogTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"destructive"}
                          className="text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-left">
                            Are you sure ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be reversed. This will delete the
                            subaccount and all the data related to the account.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton subAccountId={subaccount.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                      </AlertDialogContent>
                    </CommandItem>
                  ))
                : <div className="text-muted-foreground text-center p-4">No sub accounts.</div>}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default page;
