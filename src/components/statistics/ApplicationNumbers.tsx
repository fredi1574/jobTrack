import {
  POSSIBLE_APPLICATION_STATUSES,
  STATUS_CARD_COLORS,
  STATUS_ICONS,
} from "@/lib/constants";
import { Application } from "@prisma/client";
import { Users } from "lucide-react";
import StatisticCard from "./StatisticCard";

const statusesToDisplay = ["Total", ...POSSIBLE_APPLICATION_STATUSES];

export default function ApplicationNumbers({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
      {statusesToDisplay.map((status) => (
        <StatisticCard
          key={status}
          applications={applications}
          status={status}
          icon={
            status === "Total" ? (
              <Users className="size-4" />
            ) : (
              STATUS_ICONS[status.toLowerCase()]
            )
          }
          color={STATUS_CARD_COLORS[status.toLowerCase()]}
        />
      ))}
    </div>
  );
}
