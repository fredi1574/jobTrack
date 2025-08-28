import { Application } from "@prisma/client";
import { Award, BadgeX, ClipboardList, MailCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
      <Card className={undefined}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-center text-3xl font-bold">
            {applications.length}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-sky-100 dark:bg-sky-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Applied</CardTitle>
          <MailCheck className="h-4 w-4 text-sky-500" />
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-center text-3xl font-bold">
            {getNumberOfStatus(applications, "Applied")}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-yellow-100 dark:bg-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assessment</CardTitle>
          <ClipboardList className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-center text-3xl font-bold">
            {getNumberOfStatus(applications, "Assessment")}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-purple-100 dark:bg-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interview</CardTitle>
          <Users className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-center text-3xl font-bold">
            {getNumberOfStatus(applications, "Interview")}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-green-100 dark:bg-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offer</CardTitle>
          <Award className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-center text-3xl font-bold">
            {getNumberOfStatus(applications, "Offer")}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-red-100 dark:bg-red-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <BadgeX className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-center text-3xl font-bold">
            {getNumberOfStatus(applications, "Rejected")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
