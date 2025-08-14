import { Application } from "@prisma/client";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const chartConfig = {
  count: {
    label: "Applications",
    color: "hsl(var(--chart-primary))",
  },
} satisfies ChartConfig;

export default function ApplicationsByDate({
  applications,
}: {
  applications: Application[];
}) {
  const chartData = useMemo(() => {
    const dateCounts = applications.reduce(
      (accumulator, { appliedAt }) => {
        if (appliedAt) {
          const date = new Date(appliedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          accumulator[date] = (accumulator[date] || 0) + 1;
        }
        return accumulator;
      },
      {} as Record<string, number>,
    );

    return Object.entries(dateCounts)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [applications]);

  return (
    <ChartContainer
      id="applications-by-date-chart"
      config={chartConfig}
      className="my-4 max-h-[300px] w-full rounded-2xl border bg-gray-100 p-4 dark:bg-gray-800"
    >
      <h1 className="mt-2 text-center text-xl font-bold">
        Applications by Date
      </h1>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={chartConfig.count.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
