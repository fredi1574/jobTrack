import { Application } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getNumberOfStatus = (applications: Application[], status: string) => {
  if (status === "Total") {
    return applications.length;
  }

  return applications.filter((application) => application.status === status)
    .length;
};

export default function StatisticCard({
  applications,
  status,
  icon,
  color,
}: {
  applications: Application[];
  status: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className={`${color}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{status}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className={undefined}>
        <div className="text-center text-3xl font-bold">
          {getNumberOfStatus(applications, status)}
        </div>
      </CardContent>
    </Card>
  );
}
