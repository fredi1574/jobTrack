import { Application } from "@prisma/client";
import { Send, FileText, Users, Trophy, X } from "lucide-react";
import { Card, CardContent, CardTitle } from "../ui/card";

const getNumberOfStatus = (applications: Application[], status: string) => {
  return applications.filter((application) => application.status === status)
    .length;
};

export default function ApplicationNumbers({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Card className="flex flex-col items-center lg:w-1/4">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Total
        </CardTitle>
        <CardContent className="text-4xl font-bold">
          {applications.length}
        </CardContent>
      </Card>

      {/* Applied status */}
      <Card className="flex flex-col items-center bg-sky-100 lg:w-1/4 dark:bg-sky-800">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Send className="size-4" />
          Applied
        </CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Applied")}
        </CardContent>
      </Card>

      {/* Assessment status */}
      <Card className="bg- flex flex-col items-center bg-yellow-100 lg:w-1/4 dark:bg-yellow-500">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <FileText className="size-4" />
          Assessment
        </CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Assessment")}
        </CardContent>
      </Card>

      {/* Interview status */}
      <Card className="flex flex-col items-center bg-purple-100 lg:w-1/4 dark:bg-purple-800">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Users className="size-4" />
          Interview
        </CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Interview")}
        </CardContent>
      </Card>

      {/* Offer status */}
      <Card className="flex flex-col items-center bg-green-100 lg:w-1/4 dark:bg-green-800">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Trophy className="size-4" />
          Offer
        </CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Offer")}
        </CardContent>
      </Card>

      {/* Rejected status */}
      <Card className="flex flex-col items-center bg-red-100 lg:w-1/4 dark:bg-red-800">
        <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <X className="size-4" />
          Rejected
        </CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Rejected")}
        </CardContent>
      </Card>
    </div>
  );
}
