import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type * as core from "@/app/api/uploadthing/core";
 
export const { useUploadThing, uploadFiles } = generateReactHelpers<core.OurFileRouter>();