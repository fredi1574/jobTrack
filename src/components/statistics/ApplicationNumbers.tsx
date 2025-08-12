import { Application } from "@prisma/client";
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
        <CardTitle>Total</CardTitle>
        <CardContent className="text-4xl font-bold">
          {applications.length}
        </CardContent>
      </Card>

      {/* Applied status */}
      <Card className="flex flex-col items-center bg-sky-100 lg:w-1/4 dark:bg-sky-800">
        <CardTitle>Applied</CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Applied")}
        </CardContent>
      </Card>

      {/* Assessment status */}
      <Card className="bg- flex flex-col items-center bg-yellow-100 lg:w-1/4 dark:bg-yellow-500">
        <CardTitle>Assessment</CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Assessment")}
        </CardContent>
      </Card>

      {/* Interview status */}
      <Card className="flex flex-col items-center bg-purple-100 lg:w-1/4 dark:bg-purple-800">
        <CardTitle>Interview</CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Interview")}
        </CardContent>
      </Card>

      {/* Offer status */}
      <Card className="flex flex-col items-center bg-green-100 lg:w-1/4 dark:bg-green-800">
        <CardTitle>Offer</CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Offer")}
        </CardContent>
      </Card>

      {/* Rejected status */}
      <Card className="flex flex-col items-center bg-red-100 lg:w-1/4 dark:bg-red-800">
        <CardTitle>Rejected</CardTitle>
        <CardContent className="text-4xl font-bold">
          {getNumberOfStatus(applications, "Rejected")}
        </CardContent>
      </Card>
    </div>
  );
}
