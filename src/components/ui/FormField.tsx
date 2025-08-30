import { Label } from "./label";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  icon: React.ReactNode;
  errorMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  id,
  name,
  label,
  icon,
  errorMessage,
  children,
  className,
}: FormFieldProps): React.ReactElement {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label
        htmlFor={id}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
      >
        {icon}
        {label}
      </Label>
      {children}
      {errorMessage && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
