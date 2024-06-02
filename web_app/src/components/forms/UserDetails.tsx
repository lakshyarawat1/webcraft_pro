"use client";

import {
  AuthUserWithAgencySidebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from "@/lib/types";
import { useModal } from "@/providers/model-provider";
import { SubAccount, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from "@/lib/queries";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/FileUpload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/Loading";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { generateRandomUUID } from "@/lib/utils";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

const UserDetails = ({ id, type, subAccounts, userData }: Props) => {
  const [subAccountPermissions, setSubAccountPermissions] =
    useState<UserWithPermissionsAndSubAccounts | null>(null);

  const { data, setClose } = useModal();

  const [roleState, setRoleState] = useState("");
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySidebarOptionsSubAccounts | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const res = await getAuthUserDetails();
        if (res) {
          setAuthUserData(res);
        }
      };
      fetchDetails();
    }
  }, [data]);

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum([
      "AGENCY_OWNER",
      "AGENCY_ADMIN",
      "SUBACCOUNT_USER",
      "SUBACCOUNT_GUEST",
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permissions = await getUserPermissions(data.user.id);
      setSubAccountPermissions(permissions);
    };
    getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [data, userData]);

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!data.user?.email) return;

    const res = await changeUserPermissions(
      permissionsId ? permissionsId : generateRandomUUID(),
      data.user.email,
      subAccountId,
      val
    );

    if (type === "agency") {
      await saveActivityLogsNotification({
        agencyId: authUserData?.agency?.id,
        description: `Gave ${userData?.name} access to | ${
          subAccountPermissions?.Permissions.find(
            (p) => p.subAccountId === subAccountId
          )?.subAccount.name
        } `,
        subAccountId: subAccountPermissions?.Permissions.find(
          (p) => p.subAccountId === subAccountId
        )?.subAccount.id,
      });
    }

    if (res) {
      toast({
        title: "Success",
        description: "The request was sucessful !",
      });
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((p) => {
          if (p.subAccountId === subAccountId)
            return { ...p, access: !p.access };
          return p;
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Oops !",
        description: "Could not update the user permission !",
      });
    }
    router.refresh();
    setLoadingPermissions(false);
  };

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;

    if (userData || data?.user) {
      const updatedUser = await updateUser(values);

      authUserData?.agency?.subAccount
        .filter((subacc) =>
          authUserData.Permissions.find(
            (p) => p.subAccountId === subacc.id && p.access
          )
        )
        .forEach(async (subaccount) => {
          await saveActivityLogsNotification({
            agencyId: undefined,
            description: `Updated ${userData?.name} information`,
            subAccountId: subaccount.id,
          });
        });
      if (updatedUser) {
        toast({
          title: "Success",
          description: "Update user information",
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Oops !",
          description: "Could not update the user information !",
        });
      }
    } else {
      console.log("Error, could not submit.");
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Add or Update your information</CardDescription>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  disabled={form.formState.isSubmitting}
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile picture</FormLabel>
                      <FormControl>
                        <FileUpload
                          apiEndpoint="avatar"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={form.formState.isSubmitting}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>User full name</FormLabel>
                      <FormControl>
                        <Input required placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={form.formState.isSubmitting}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={
                            userData?.role === "AGENCY_OWNER" ||
                            form.formState.isSubmitting
                          }
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={form.formState.isSubmitting}
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel> User Role</FormLabel>
                      <Select
                        disabled={field.value === "AGENCY_OWNER"}
                        onValueChange={(value: string) => {
                          if (
                            value === "SUBACCOUNT_USER" ||
                            value === "SUBACCOUNT_GUEST"
                          ) {
                            setRoleState(
                              "You need to have subaccounts to assign Subaccount access to team members."
                            );
                          } else {
                            setRoleState("");
                          }
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user role..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AGENCY_ADMING">
                            Agency Admin
                          </SelectItem>
                          {(data?.user?.role === "AGENCY_OWNER" ||
                            userData?.role === "AGENCY_OWNER") && (
                            <SelectItem value="AGENCY_OWNER">
                              Agency Owner
                            </SelectItem>
                          )}
                          <SelectItem value="SUBACCOUNT_USER">
                            Sub Account User
                          </SelectItem>
                          <SelectItem value="SUBACCOUNT_GUEST">
                            Sub Account Guest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground">{roleState}</p>
                    </FormItem>
                  )}
                />

                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? (
                    <Loading />
                  ) : (
                    "Save User Details"
                  )}
                </Button>
                {authUserData?.role === "AGENCY_OWNER" && (
                  <div>
                    <Separator className="my-4" />
                    <FormLabel> User Permissions</FormLabel>
                    <FormDescription className="mb-4">
                      You can give Sub Account access to team member by turning
                      on access control for each Sub Account. This is only
                      visible to agency owners
                    </FormDescription>
                    <div className="flex flex-col gap-4">
                      {subAccounts?.map((subAccount) => {
                        const subAccountPermissionsDetails =
                          subAccountPermissions?.Permissions.find(
                            (p) => p.subAccountId === subAccount.id
                          );
                        return (
                          <div
                            key={subAccount.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div>
                              <p>{subAccount.name}</p>
                            </div>
                            <Switch
                              disabled={loadingPermissions}
                              checked={subAccountPermissionsDetails?.access}
                              onCheckedChange={(permission) => {
                                onChangePermission(
                                  subAccount.id,
                                  permission,
                                  subAccountPermissionsDetails?.id
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default UserDetails;
