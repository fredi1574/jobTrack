"use client";
import { importApplications } from "@/app/actions/import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionResult } from "@/types/actions";
import { File as FileIcon, Loader, UploadCloud, X } from "lucide-react";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

const initialState: ActionResult = {
  message: undefined,
  error: undefined,
  fieldErrors: undefined,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full"
      size="lg"
      variant={undefined}
    >
      {pending ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Importing...
        </>
      ) : (
        "Import CSV"
      )}
    </Button>
  );
}

export function CSVImportForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(importApplications, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "CSV imported successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-6 p-1">
      <div>
        <label
          htmlFor="csv-upload"
          className="dark:hover:bg-bray-800 relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          {selectedFile ? (
            <div className="text-center">
              <FileIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="font-semibold">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-red-500 hover:text-red-700"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  handleRemoveFile();
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Click to upload
              </p>
            </div>
          )}
          <Input
            id="csv-upload"
            ref={fileInputRef}
            type="file"
            name="file" // Add name attribute for FormData
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-semibold">CSV file requirements:</p>
        <ul className="list-inside list-disc pl-4">
          <li>Must be a valid CSV file.</li>
          <li>
            Required columns: `company`, `position`, `location`, `status`,
            `appliedAt`.
          </li>
          <li>Optional columns: `url`, `notes`, `resumeUrl`.</li>
        </ul>
      </div>

      <SubmitButton />
    </form>
  );
}
