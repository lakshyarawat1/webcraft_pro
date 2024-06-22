import React from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import { generateRandomUUID } from "@/lib/utils";
import { Input } from "../ui/input";
import FileUpload from "../global/FileUpload";
import { Button } from "../ui/button";

type Props = {
  subAccountId: string;
};

const formSchema = z.object({
  link: z.string().min(1, { message: "Media File is required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

const UploadMediaForm = ({ subAccountId }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await createMedia(subAccountId, {
        ...values,
        id: generateRandomUUID(),
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded a media file | ${response.name}`,
        subAccountId,
      });

      toast({
        title: "Success",
        description: "Uploaded media",
      });

      router.refresh();
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Couldnot upload media !",
      });
    }
  }

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Agency Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4"
            >
              Upload media
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default UploadMediaForm;
