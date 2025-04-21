import { Pencil, Trash2 } from "lucide-react";

export default function ApplicationActions({ application, onEdit, onDelete }) {
  const handleEditClick = (event) => {
    event.stopPropagation();
    onEdit(application);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(application.id);
  };

  return (
    <div className="flex shrink-0 items-center gap-2 pl-1 sm:gap-3 sm:pl-2">
      <Pencil
        onClick={handleEditClick}
        className="size-4 cursor-pointer text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
        aria-label="Edit Application"
      />
      <Trash2
        onClick={handleDeleteClick}
        className="size-4 cursor-pointer text-gray-500 hover:text-red-600 dark:hover:text-red-400"
        aria-label="Delete Application"
      />
    </div>
  );
}
