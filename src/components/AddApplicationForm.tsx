"use client";
import { createApplication } from "@/app/actions";
import {
  Briefcase,
  Calendar,
  CircleCheck,
  FileText,
  LinkIcon,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import FileUploadDropzone from "./FileUploadDropzone";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
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

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const initialState: ActionResult = {
  message: undefined,
  error: undefined,
  fieldErrors: undefined,
  success: false,
};

function SubmitButton(): React.ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      variant="outline"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full cursor-pointer bg-sky-500 text-white transition-colors hover:bg-sky-600"
    >
      {pending ? "Adding..." : "Add Application"}
    </Button>
  );
}

function CancelButton(): React.ReactElement {
  return (
    <DialogClose asChild>
      <Button
        size="sm"
        variant="outline"
        type="button"
        className="w-full cursor-pointer"
      >
        Cancel
      </Button>
    </DialogClose>
  );
}

interface AddApplicationFormProps {
  onSuccess?: () => void;
}

export default function AddApplicationForm({
  onSuccess,
}: AddApplicationFormProps): React.ReactElement {
  const [state, formAction] = useActionState(createApplication, initialState);

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        onSuccess();
      }
      toast.success("Application added successfully!", {
        icon: <span>➕</span>,
      });
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
            type="text"
            id="company"
            name="company"
            required
            placeholder="e.g. Google"
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
            type="text"
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
            type="text"
            id="location"
            name="location"
            required
            placeholder="e.g. Tel-Aviv"
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
            type="url"
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
        <div className="space-y-2">
          <Label
            htmlFor="appliedAt"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Date Applied
          </Label>
          <Input
            type="date"
            id="appliedAt"
            name="appliedAt"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-40 border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          {state?.fieldErrors?.appliedAt && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.appliedAt.join(", ")}
            </p>
          )}
        </div>
      </div>

      <FileUploadDropzone
        id="resumeFile"
        name="resumeFile"
        label="Resume"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        maxSizeMB={5}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <CircleCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Application Status
          </Label>
          <Select name="status" required>
            <SelectTrigger
              id="status"
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="Applied">
                Applied
              </SelectItem>
              <SelectItem className="" value="Assessment">
                Assessment
              </SelectItem>
              <SelectItem className="" value="Interview">
                Interview
              </SelectItem>
              <SelectItem className="" value="Offer">
                Offer
              </SelectItem>
              <SelectItem className="" value="Rejected">
                Rejected
              </SelectItem>
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

      <div className="flex flex-col gap-4 pt-4">
        <SubmitButton />
        <CancelButton />
      </div>
    </form>
  );
}
