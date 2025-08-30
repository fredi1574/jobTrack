"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function CSVImportForm({ onSuccess }: { onSuccess?: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
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

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <h3 className="text-lg font-semibold">
        Import Job Applications from CSV
      </h3>
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="w-full"
      />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full"
        variant="default"
        size="default"
      >
        {isUploading ? "Importing..." : "Import CSV"}
      </Button>
      <p className="text-sm text-gray-500">
        Make sure your CSV has columns like &apos;company&apos;,
        &apos;position&apos;, &apos;location&apos;, &apos;url&apos;,
        &apos;status&apos;, &apos;notes&apos;, &apos;resumeUrl&apos;,
        &apos;appliedAt&apos;.
      </p>
    </div>
  );
}
