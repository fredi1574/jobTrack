"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File as FileIcon, UploadCloud, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

export function CSVImportForm({ onSuccess }: { onSuccess?: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type !== "text/csv") {
        toast.error("Please select a valid CSV file.");
        return;
      }
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file to upload.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", session.user.id);

    try {
      const response = await fetch("/api/import-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "CSV imported successfully!");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (onSuccess) {
          onSuccess();
        }
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to import CSV.");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1">
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

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full"
        size="lg"
        variant={undefined}
      >
        {isUploading ? (
          <>
            <svg
              className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Importing...
          </>
        ) : (
          "Import CSV"
        )}
      </Button>
    </div>
  );
}
