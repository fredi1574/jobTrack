import { Application } from "@prisma/client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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

export default function ApplicationsByPosition({
  applications,
}: {
  applications: Application[];
}) {
  const chartData = useMemo(() => {
    const positionCounts = applications.reduce(
      (accumulator, { position }) => {
        const normalizedPosition = position.trim();
        if (normalizedPosition) {
          accumulator[normalizedPosition] =
            (accumulator[normalizedPosition] || 0) + 1;
        }
        return accumulator;
      },
      {} as Record<string, number>,
    );
    return Object.entries(positionCounts)
      .map(([position, count]) => ({
        position,
        count,
      }))
      .sort((a: any, b: any) => b.count - a.count);
  }, [applications]);

  return (
    <ChartContainer
      id="applications-by-position-chart"
      config={chartConfig}
      className="my-4 max-h-[300px] w-full rounded-2xl border bg-gray-100 p-4 dark:bg-gray-800"
    >
      <h1 className="mt-2 text-center text-xl font-bold">
        Applications by Position
      </h1>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 10,
          right: 10,
          top: 10,
          bottom: 40,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="position"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          angle={-15}
          textAnchor="end"
          interval={0}
        />
        <YAxis allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
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
        <Bar dataKey="count" fill={chartConfig.count.color} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
