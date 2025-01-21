"use server";
import { utapi } from "@/server/uploadthing";

export const uploadNewFile = async (formData: FormData) => {
  // console.log("uploadNewFile", formData);

  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const { data } = await utapi.uploadFiles(file);
    return data?.url || null;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
};

export const uploadMultipleNewFiles = async (formData: FormData) => {
  try {
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) throw new Error("No files provided");

    const uploadedFiles = await utapi.uploadFiles(files);

    const uploadedFilesUrls = uploadedFiles.map((file) => file?.data?.url);
    return uploadedFilesUrls;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw new Error("Multiple file upload failed");
  }
};

export const removeFile = async (file: string) => {
  try {
    const res = await utapi.deleteFiles(file);

    return res.success;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Deleting file failed");
  }
};

export const removeMultipleFiles = async (files: string[]) => {
  try {
    const res = await utapi.deleteFiles(files);
    return res.success;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Deleting file failed");
  }
};
