"use client";
import { createApplication } from "@/app/actions/application";
import { parseJobDetails } from "@/app/actions/parse";
import { scrapeJob } from "@/app/actions/scrape";
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
  Loader,
  MailCheck,
  MapPin,
  MessageSquare,
  MessagesSquare,
  Search,
} from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
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

interface ApplicationFormData {
  company: string;
  position: string;
  location: string;
  url: string;
  jobSource: string;
  salary: string;
  notes: string;
  interviewDate?: string;
  jobDescription?: string;
}

const initialFormData: ApplicationFormData = {
  company: "",
  position: "",
  location: "",
  url: "",
  jobSource: "",
  salary: "",
  notes: "",
  interviewDate: "",
  jobDescription: "",
};

import { ActionResult } from "@/types/actions";
import { Button } from "../ui/button";

const initialState: ActionResult = {
  success: false,
};

import { Application } from "@prisma/client";

interface AddApplicationFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Application> | null;
}

export default function AddApplicationForm({
  onSuccess,
  initialData,
}: AddApplicationFormProps) {
  const [state, formAction] = useActionState(createApplication, initialState);
  const [isScraping, startScraping] = useTransition();
  const [isParsing, startParsing] = useTransition();
  const [formData, setFormData] =
    useState<ApplicationFormData>(initialFormData);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (state.success) {
      toast.success("Application added successfully!", {
        icon: <span>➕</span>,
      });
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        company: initialData.company || prev.company,
        position: initialData.position || prev.position,
        location: initialData.location || prev.location,
        url: initialData.url || prev.url,
        jobSource: initialData.jobSource || prev.jobSource,
        salary: initialData.salary?.toString() || prev.salary,
        notes: initialData.notes || prev.notes,
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParse = async () => {
    if (!formData.jobDescription) {
      toast.error("Please paste the job description to parse.");
      return;
    }
    startParsing(async () => {
      try {
        const result = await parseJobDetails(formData.jobDescription as string);
        if (result) {
          setFormData((prev) => ({
            ...prev,
            company: result.company || prev.company,
            position: result.position || prev.position,
            location: result.location || prev.location,
            url: result.url || prev.url,
            jobSource: result.jobSource || prev.jobSource,
            salary: result.salary?.toString() || prev.salary,
            notes: Array.isArray(result.notes)
              ? result.notes.join("\n")
              : result.notes || prev.notes,
          }));
          toast.success("Job details parsed successfully!");
        }
      } catch (error: any) {
        const errorMessage =
          error.message || "An unknown error occurred while parsing.";
        toast.error(errorMessage);
      }
    });
  };

  const handleScrape = () => {
    if (!formData.url) {
      toast.error("Please enter a URL to scrape.");
      return;
    }
    startScraping(async () => {
      const result = await scrapeJob(formData.url);
      if (result.success && result.data) {
        const {
          "Company Name": company,
          "Position/Job Title": position,
          Location: location,
          "Job Source": jobSource,
          Salary: salary,
          Notes: notes,
        } = result.data;

        setFormData((prev) => ({
          ...prev,
          company: company || prev.company,
          position: position || prev.position,
          location: location || prev.location,
          jobSource: jobSource || prev.jobSource,
          salary: salary || prev.salary,
          notes: notes || prev.notes,
        }));
        toast.success("Job details fetched successfully!");
      } else {
        toast.error("An unknown error occurred while scraping.");
      }
    });
  };

  return (
    <form action={formAction} className="space-y-6 pt-4">
      {state.error && !state.fieldErrors && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.error}
        </div>
      )}
      <FormField
        id="jobDescription"
        name="jobDescription"
        label="Paste Job Description"
        icon={
          <ClipboardList className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        }
        className="md:col-span-2"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea
            id="jobDescription"
            name="jobDescription"
            rows={6}
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the full job description here to be parsed by AI."
            className="max-h-96 resize-y border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
          <Button
            type="button"
            onClick={handleParse}
            disabled={isParsing}
            className="sm:mt-0"
            variant="outline"
            size={undefined}
          >
            {isParsing ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Parse Details
          </Button>
        </div>
      </FormField>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          id="company"
          name="company"
          label="Company Name *"
          icon={
            <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state.fieldErrors?.company?.join(", ")}
        >
          <Input
            type="text"
            id="company"
            name="company"
            required
            placeholder="e.g. Google"
            value={formData.company}
            onChange={handleChange}
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
          errorMessage={state.fieldErrors?.position?.join(", ")}
        >
          <Input
            type="text"
            id="position"
            name="position"
            required
            placeholder="e.g. Frontend Developer"
            value={formData.position}
            onChange={handleChange}
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="location"
          name="location"
          label="Location *"
          icon={<MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
          errorMessage={state.fieldErrors?.location?.join(", ")}
        >
          <Input
            type="text"
            id="location"
            name="location"
            required
            placeholder="e.g. Tel-Aviv"
            value={formData.location}
            onChange={handleChange}
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
          errorMessage={state.fieldErrors?.url?.join(", ")}
        >
          <div className="flex items-center gap-2">
            <Input
              type="url"
              id="url"
              name="url"
              placeholder="https://www.example.com/job"
              value={formData.url}
              onChange={handleChange}
              className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
            />
            {/* Temporarily disabled the scrape button */}
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => {
                    handleScrape();
                  }}
                  disabled={isScraping}
                  className="p-2"
                  variant="outline"
                  size={undefined}
                >
                  {isScraping ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className={undefined}>
                <p>
                  Pasting a job link and clicking the search icon will attempt
                  to automatically fill in the form. This may not work for all
                  websites.
                </p>
              </TooltipContent>
            </Tooltip> */}
          </div>
        </FormField>

        <FormField
          id="appliedAt"
          name="appliedAt"
          label="Date Applied *"
          icon={
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state.fieldErrors?.appliedAt?.join(", ")}
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
          errorMessage={state.fieldErrors?.jobSource?.join(", ")}
        >
          <Input
            type="text"
            id="jobSource"
            name="jobSource"
            placeholder="e.g. LinkedIn, Company Website"
            value={formData.jobSource}
            onChange={handleChange}
            className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>

        <FormField
          id="salary"
          name="salary"
          label="Salary (NIS)"
          icon={<span className="text-gray-500 dark:text-gray-400">₪</span>}
          errorMessage={state.fieldErrors?.salary?.join(", ")}
        >
          <Input
            type="number"
            id="salary"
            name="salary"
            placeholder="e.g. 20,000"
            min="1"
            value={formData.salary}
            onChange={handleChange}
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
          label="Application Status *"
          icon={
            <CircleCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          errorMessage={state.fieldErrors?.status?.join(", ")}
        >
          <Select name="status" required onValueChange={setSelectedStatus}>
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
            errorMessage={state.fieldErrors?.interviewDate?.join(", ")}
          >
            <Input
              type="datetime-local"
              id="interviewDate"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  interviewDate: e.target.value,
                }))
              }
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
          errorMessage={state.fieldErrors?.notes?.join(", ")}
          className="md:col-span-2"
        >
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any relevant details about the application..."
            className="resize-y border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-700"
          />
        </FormField>
      </div>

      <div className="flex flex-col pt-4 sm:justify-end sm:gap-2">
        <SubmitButton
          text="Add Application"
          pendingText="Adding..."
          icon={<CirclePlus className="h-4 w-4" />}
        />
        <CancelButton />
      </div>
    </form>
  );
}
