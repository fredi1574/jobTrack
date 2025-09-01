import { Application } from "@prisma/client";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
    color: "#3b82f6",
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
      className="max-h-[300px] w-full"
    >
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
        <YAxis allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              active={undefined}
              payload={undefined}
              className={undefined}
              label={undefined}
              labelFormatter={undefined}
              labelClassName={undefined}
              formatter={undefined}
              color={undefined}
              nameKey={undefined}
              labelKey={undefined}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={chartConfig.count.color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
