import { createApplication } from "@/app/actions";
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
      className="w-full cursor-pointer bg-sky-300 text-sky-950 hover:bg-sky-400"
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
    // The action prop takes the function returned by useActionState
    // We remove the outer div/container styling as it's now inside a modal
    <form action={formAction} className="space-y-4 pt-4">
      {/* Adjust padding if needed */}
      {/* Display general success/error messages */}
      {/* Success messages might be less needed if modal closes automatically */}
      {/* {state?.message && <p className="text-sm text-green-600">{state.message}</p>} */}
      {state?.error && !state.fieldErrors && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {/* Form Fields */}
      <div className="space-y-1.5">
        <Label htmlFor="company">Company Name</Label>
        <Input id="company" name="company" required />
        {state?.fieldErrors?.company && (
          <p className="text-xs text-red-600">
            {state.fieldErrors.company.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="position">Position / Job Title</Label>
        <Input id="position" name="position" required />
        {state?.fieldErrors?.position && (
          <p className="text-xs text-red-600">
            {state.fieldErrors.position.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required />
        {state?.fieldErrors?.city && (
          <p className="text-xs text-red-600">
            {state.fieldErrors.city.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="url">Link</Label>
        <Input id="url" name="url" placeholder="https://www.example.com" />
        {state?.fieldErrors?.url && (
          <p className="text-xs text-red-600">
            {state.fieldErrors.city.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select name="status" required>
          <SelectTrigger id="status">
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
          <p className="text-xs text-red-600">
            {state.fieldErrors.status.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} />
        {state?.fieldErrors?.notes && (
          <p className="text-xs text-red-600">
            {state.fieldErrors.notes.join(", ")}
          </p>
        )}
      </div>
      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
