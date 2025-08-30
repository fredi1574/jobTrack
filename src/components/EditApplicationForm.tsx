"use client";
import { updateApplication } from "@/app/actions";
import { Application as PrismaApplication } from "@prisma/client";
import {
  Award,
  BadgeCheck,
  BadgeX,
  Briefcase,
  Calendar,
  ClipboardList,
  FileText,
  LinkIcon,
  MailCheck,
  MapPin,
  MessageSquare,
  Save,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import FileUploadDropzone from "./FileUploadDropzone";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
import FormField from "./ui/FormField";
import { Input } from "./ui/input";
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

const initialEditState: ActionResult = {
  message: undefined,
  error: undefined,
  fieldErrors: undefined,
  success: false,
};

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      variant="outline"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full cursor-pointer bg-blue-500 text-white transition-colors hover:bg-blue-600"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg
            className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
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
          Updating...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </span>
      )}
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

interface EditApplicationFormProps {
  applicationData: PrismaApplication;
  onClose?: () => void;
}

export default function EditApplicationForm({
  applicationData,
  onClose,
}: EditApplicationFormProps): React.ReactElement {
  const [state, formAction] = useActionState(
    updateApplication,
    initialEditState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      if (onClose) {
        onClose();
      }
      router.refresh();
      toast.info("Application updated successfully!", {
        icon: <span>✏️</span>,
      });
    }
    if (state?.error && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state?.success, state?.error, state?.fieldErrors, router, onClose]);

  if (!applicationData) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">
          Error: No application data provided for editing.
        </p>
        <p className="mt-1">
          Please try again or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 pt-4">
      <input type="hidden" name="id" value={applicationData.id} />

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
            defaultValue={applicationData.company}
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
            defaultValue={applicationData.position}
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
            defaultValue={applicationData.location}
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
            defaultValue={applicationData.url}
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
            defaultValue={
              applicationData.appliedAt
                ? (() => {
                    const date = new Date(applicationData.appliedAt);
                    const year = date.getUTCFullYear();
                    const month = String(date.getUTCMonth() + 1).padStart(
                      2,
                      "0",
                    );
                    const day = String(date.getUTCDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                  })()
                : ""
            }
            className="w-40 border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>
      </div>

      <FileUploadDropzone
        id="resumeFile"
        name="resumeFile"
        label="Resume"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        maxSizeMB={5}
        currentFileUrl={applicationData.resumeUrl}
        currentFileName="View current resume"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          id="status"
          name="status"
          label="Application Status"
          icon={
            <BadgeCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.status?.join(", ")}
        >
          <Select name="status" required defaultValue={applicationData.status}>
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
                <Users className="size-4" />
                Interview
              </SelectItem>
              <SelectItem className="flex items-center gap-2" value="Offer">
                <Award className="size-4" />
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
            defaultValue={applicationData.notes ?? ""}
            className="resize-none border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <UpdateButton />
        <CancelButton />
      </div>
    </form>
  );
}