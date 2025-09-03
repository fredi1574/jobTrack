import { Label } from "@radix-ui/react-label";
import { FileText, FileUp, XCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface FileUploadDropzoneProps {
  id: string;
  name: string;
  label: string;
  accept?: string;
  maxSizeMB?: number;
  currentFileUrl?: string | null;
  currentFileName?: string;
  onFileRemoved?: () => void;
  required?: boolean;
}

const fileTypeDisplayNames: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word",
};

export default function FileUploadDropzone({
  id,
  name,
  label,
  accept = ".pdf,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSizeMB = 5,
  currentFileUrl,
  currentFileName = "View current file",
  onFileRemoved,
  required = false,
}: FileUploadDropzoneProps): React.ReactElement {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;

  const getDisplayableAcceptTypes = (
    acceptString: string | undefined,
  ): string => {
    if (!acceptString) return "";
    return acceptString
      .split(",")
      .map((typeOrExt) => {
        const trimmed = typeOrExt.trim().toLowerCase();
        // Look up in map or fallback to uppercase extension/subtype
        return (
          fileTypeDisplayNames[trimmed] ||
          trimmed.split("/").pop()?.toUpperCase() ||
          trimmed.replace(".", "").toUpperCase() ||
          "File"
        );
      })
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .join(", ");
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > maxSizeInBytes) {
          toast.error(
            `File size exceeds ${maxSizeMB} MB. Please select a smaller file.`,
          );
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setSelectedFile(null);
          return;
        }
        setSelectedFile(file);

        if (currentFileUrl && onFileRemoved) {
          onFileRemoved();
        }
      } else {
        setSelectedFile(null);
      }
    },
    [maxSizeMB, onFileRemoved, currentFileUrl, maxSizeInBytes],
  );

  const handleRemoveFile = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const displayMode = selectedFile
    ? "selected"
    : currentFileUrl
      ? "current"
      : "dropzone";

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
      >
        <FileUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div
        className={`flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors dark:border-gray-600 ${
          displayMode === "selected"
            ? "border-blue-300 bg-blue-50 dark:bg-indigo-950/30"
            : displayMode === "current"
              ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
              : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:hover:bg-gray-700/50"
        }`}
      >
        {displayMode === "dropzone" && (
          <label
            htmlFor={id}
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center p-4"
          >
            <FileUp className="mb-3 h-8 w-8 text-gray-400" />
            <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Click to upload
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Accepts: {getDisplayableAcceptTypes(accept)} (Max {maxSizeMB} MB)
            </p>
          </label>
        )}

        {displayMode === "selected" && selectedFile && (
          <div className="flex h-32 w-full flex-col items-center justify-center p-4 text-center">
            <FileText className="mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium break-all text-gray-800 dark:text-gray-200">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="mt-2 text-red-600 hover:bg-red-100/50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
              aria-label="Remove selected file"
            >
              <XCircle className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        )}

        {displayMode === "current" && currentFileUrl && (
          <div className="flex h-32 w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {currentFileName}
            </p>
            <a
              href={currentFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              ({currentFileName})
            </a>
            <label
              htmlFor={id}
              className="mt-2 cursor-pointer text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Click here to replace
            </label>
          </div>
        )}

        <Input
          ref={fileInputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
