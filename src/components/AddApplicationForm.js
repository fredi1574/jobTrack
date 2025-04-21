"use client";
import { createApplication } from "@/app/actions";
import {
  Briefcase,
  FileText,
  FileUp,
  LinkIcon,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const initialState = {
  message: null,
  error: null,
  fieldErrors: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full cursor-pointer bg-sky-500 text-white transition-colors hover:bg-sky-600"
    >
      {pending ? "Adding..." : "Add Application"}
    </Button>
  );
}

export default function AddApplicationForm({ onSuccess }) {
  const [state, formAction] = useActionState(createApplication, initialState);

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        onSuccess();
      }
      toast.success("Application added successfully!", { icon: "➕" });
    }
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-6 pt-4">
      {state?.error && !state.fieldErrors && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="company"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Company Name
          </Label>
          <Input
            id="company"
            name="company"
            required
            placeholder="e.g. Acme Inc."
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          {state?.fieldErrors?.company && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.company.join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="position"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Position / Job Title
          </Label>
          <Input
            id="position"
            name="position"
            required
            placeholder="e.g. Frontend Developer"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          {state?.fieldErrors?.position && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.position.join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Location
          </Label>
          <Input
            id="location"
            name="location"
            required
            placeholder="e.g. Remote, New York, NY"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          {state?.fieldErrors?.location && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.location.join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="url"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Job Link
          </Label>
          <Input
            id="url"
            name="url"
            placeholder="https://www.example.com/job"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          {state?.fieldErrors?.url && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.url.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="resumeFile"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <FileUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          Resume (PDF, DOCX)
        </Label>
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="resumeFile"
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700/30 dark:hover:bg-gray-700/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="mb-3 h-8 w-8 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF or DOCX (Max 5MB)
              </p>
            </div>
            <Input
              id="resumeFile"
              name="resumeFile"
              type="file"
              accept=".pdf,.docx"
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500 dark:text-gray-400"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Application Status
          </Label>
          <Select name="status" required>
            <SelectTrigger
              id="status"
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Assessment">Assessment</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          {state?.fieldErrors?.status && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.status.join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="notes"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add any relevant details about the application..."
            className="resize-none border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          {state?.fieldErrors?.notes && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.notes.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
