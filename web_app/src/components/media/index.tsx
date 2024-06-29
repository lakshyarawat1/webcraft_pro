import { GetMediaFiles } from "@/lib/types";
import { UploadButton } from "@uploadthing/react";
import React from "react";
import MediaUploadButton from "./uploadButtons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import MediaCard from "./MediaCard";

type Props = {
  data: GetMediaFiles;
  subAccountId: string;
};

const MediaComponent = ({ data, subAccountId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton subAccountId={subAccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search files here ..." />
        <CommandList className="pb-40 max-h-full">
          <CommandEmpty>No media files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file}></MediaCard>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
