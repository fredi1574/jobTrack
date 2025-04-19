"use client";
import { updateApplication } from "@/app/actions"; // Import the UPDATE action
import { useRouter } from "next/navigation";
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

const initialEditState = {
  message: null,
  error: null,
  fieldErrors: null,
  success: false,
};

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
    >
      {pending ? "Updating..." : "Save Changes"}
    </Button>
  );
}

export default function EditApplicationForm({ applicationData, onSuccess }) {
  const [state, formAction] = useActionState(
    updateApplication,
    initialEditState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        onSuccess();
      }
      router.refresh();
      toast.info("Application updated successfully!", { icon: "✏️" });
    }
    if (state?.error && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state?.success, state?.error, state?.fieldErrors, onSuccess, router]);

  if (!applicationData) {
    return (
      <p className="text-red-500">
        Error: No application data provided for editing.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <input type="hidden" name="id" value={applicationData.id} />

      {/* Display general errors */}
      {/* {state?.error && !state.fieldErrors && (
        <p className="text-sm text-red-600">{state.error}</p>
      )} */}

      {/* Form Fields with defaultValue */}
      <div className="space-y-1.5">
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          name="company"
          required
          defaultValue={applicationData.company}
        />
        {/* Display field errors if needed */}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="position">Position / Job Title</Label>
        <Input
          id="position"
          name="position"
          required
          defaultValue={applicationData.position}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          required
          defaultValue={applicationData.location}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="url">Link</Label>
        <Input id="url" name="url" defaultValue={applicationData.url ?? ""} />
      </div>

      {/* File Upload */}
      <div className="space-y-1.5">
        <Label htmlFor="resumeFile">Resume (PDF, DOCX)</Label>
        <Input
          id="resumeFile"
          name="resumeFile"
          type="file"
          accept=".pdf,.docx"
          className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select name="status" required defaultValue={applicationData.status}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={applicationData.notes ?? ""}
        />
      </div>
      <div className="flex justify-end pt-2">
        <UpdateButton />
      </div>
    </form>
  );
}
