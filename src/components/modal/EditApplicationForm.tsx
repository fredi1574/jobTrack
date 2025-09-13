"use client";
import { updateApplication } from "@/app/actions/application";
import { ActionResult } from "@/types/actions";
import { Application as PrismaApplication } from "@prisma/client";
import {
  BadgeCheck,
  BadgeX,
  Briefcase,
  Calendar,
  ClipboardList,
  FileText,
  Handshake,
  LinkIcon,
  MailCheck,
  MapPin,
  MessageSquare,
  MessagesSquare,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
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
import FileUploadDropzone from "./FileUploadDropzone";
import { CancelButton, SubmitButton } from "./FormButtons";

const initialEditState: ActionResult = {
  message: undefined,
  error: undefined,
  fieldErrors: undefined,
  success: false,
};

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
  const [selectedStatus, setSelectedStatus] = useState<string>(
    applicationData.status,
  );
  const [interviewDate, setInterviewDate] = useState<string>("");

  useEffect(() => {
    if (applicationData.interviewDate) {
      const localDate = new Date(applicationData.interviewDate);
      const year = localDate.getFullYear();
      const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
      const day = localDate.getDate().toString().padStart(2, "0");
      const hours = localDate.getHours().toString().padStart(2, "0");
      const minutes = localDate.getMinutes().toString().padStart(2, "0");
      setInterviewDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    }

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
  }, [state?.success, state?.error, state?.fieldErrors, router, onClose, applicationData.interviewDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      const date = new Date(value);
      const formattedDate = date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0') + 'T' +
        date.getHours().toString().padStart(2, '0') + ':' +
        date.getMinutes().toString().padStart(2, '0');
      setInterviewDate(formattedDate);
    } else {
      setInterviewDate("");
    }
  };

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
          label="Company Name *"
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
          label="Position / Job Title *"
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
          label="Location *"
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
          label="Date Applied *"
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
            defaultValue={applicationData.jobSource ?? ""}
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
            min="1"
            defaultValue={applicationData.salary ?? ""}
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
        currentFileUrl={applicationData.resumeUrl}
        currentFileName="View current resume"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          id="status"
          name="status"
          label="Application Status *"
          icon={
            <BadgeCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state?.fieldErrors?.status?.join(", ")}
        >
          <Select
            name="status"
            required
            defaultValue={applicationData.status}
            onValueChange={setSelectedStatus}
          >
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

        {selectedStatus === "Interview" && (
          <FormField
            id="interviewDate"
            name="interviewDate"
            label="Interview Date and Time"
            icon={
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
            errorMessage={state?.fieldErrors?.interviewDate?.join(", ")}
          >
            <Input
              type="datetime-local"
              id="interviewDate"
              name="interviewDate"
              value={interviewDate}
              onChange={handleDateChange}
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
            />
          </FormField>
        )}

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
        <SubmitButton
          text="Save Changes"
          pendingText="Updating..."
          icon={<Save className="h-4 w-4" />}
        />
        <CancelButton />
      </div>
    </form>
  );
}
