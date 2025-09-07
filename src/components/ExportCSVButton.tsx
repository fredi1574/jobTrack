import { formatDate } from "@/lib/date.utils";
import { Download } from "lucide-react";
import { CSVLink } from "react-csv";
import { Button } from "./ui/button";

interface ExportCSVButtonProps {
  data: any[];
}

export default function ExportCSVButton({ data }: ExportCSVButtonProps) {
  return (
    <Button variant="ghost" asChild className={undefined} size={undefined}>
      <CSVLink
        data={data}
        filename={`job-applications - ${formatDate(new Date())}.csv`}
      >
        <Download className="h-4 w-4" />
        Export
      </CSVLink>
    </Button>
  );
}
