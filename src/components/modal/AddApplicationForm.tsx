"use client";
import { createApplication } from "@/app/actions";
import {
  BadgeX,
  Briefcase,
  Calendar,
  CircleCheck,
  CirclePlus,
  ClipboardList,
  FileText,
  Handshake,
  LinkIcon,
  MailCheck,
  MapPin,
  MessageSquare,
  MessagesSquare,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import FileUploadDropzone from "../FileUploadDropzone";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import FormField from "../ui/FormField";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

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
      className="w-full bg-green-500 transition-colors hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
    >
      <CirclePlus className="h-4 w-4" />
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
        className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
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
      toast.success("Application added successfully!", {
        icon: <span>➕</span>,
      });
      if (onSuccess) {
        onSuccess();
      }
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
        <FormField
          id="company"
          name="company"
          label="Company Name"
          icon={
            <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.company?.join(", ")}
        >
          <Input
            type="text"
            id="company"
            name="company"
            required
            placeholder="e.g. Google"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="position"
          name="position"
          label="Position / Job Title"
          icon={
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.position?.join(", ")}
        >
          <Input
            type="text"
            id="position"
            name="position"
            required
            placeholder="e.g. Frontend Developer"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="location"
          name="location"
          label="Location"
          icon={<MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
          errorMessage={state?.fieldErrors?.location?.join(", ")}
        >
          <Input
            type="text"
            id="location"
            name="location"
            required
            placeholder="e.g. Tel-Aviv"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="url"
          name="url"
          label="Job Link"
          icon={
            <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.url?.join(", ")}
        >
          <Input
            type="url"
            id="url"
            name="url"
            placeholder="https://www.example.com/job"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="appliedAt"
          name="appliedAt"
          label="Date Applied"
          icon={
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.appliedAt?.join(", ")}
        >
          <Input
            type="date"
            id="appliedAt"
            name="appliedAt"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-40 border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="jobSource"
          name="jobSource"
          label="Job Source"
          icon={
            <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.jobSource?.join(", ")}
        >
          <Input
            type="text"
            id="jobSource"
            name="jobSource"
            placeholder="e.g. LinkedIn, Company Website"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="salary"
          name="salary"
          label="Salary (NIS)"
          icon={<span className="text-gray-500 dark:text-gray-400">$</span>}
          errorMessage={state?.fieldErrors?.salary?.join(", ")}
        >
          <Input
            type="number"
            id="salary"
            name="salary"
            placeholder="e.g. 20,000"
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>
      </div>

      <FileUploadDropzone
        id="resumeFile"
        name="resumeFile"
        label="Resume"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        maxSizeMB={5}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          id="status"
          name="status"
          label="Application Status"
          icon={
            <CircleCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.status?.join(", ")}
        >
          <Select name="status" required>
            <SelectTrigger
              id="status"
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="flex items-center gap-2" value="Applied">
                <MailCheck className="size-4" />
                Applied
              </SelectItem>
              <SelectItem
                className="flex items-center gap-2"
                value="Assessment"
              >
                <ClipboardList className="size-4" />
                Assessment
              </SelectItem>
              <SelectItem className="flex items-center gap-2" value="Interview">
                <MessagesSquare className="size-4" />
                Interview
              </SelectItem>
              <SelectItem className="flex items-center gap-2" value="Offer">
                <Handshake className="size-4" />
                Offer
              </SelectItem>
              <SelectItem className="flex items-center gap-2" value="Rejected">
                <BadgeX className="size-4" />
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          id="notes"
          name="notes"
          label="Notes"
          icon={
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.notes?.join(", ")}
          className="md:col-span-2"
        >
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add any relevant details about the application..."
            className="resize-none border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <SubmitButton />
        <CancelButton />
      </div>
    </form>
  );
}
