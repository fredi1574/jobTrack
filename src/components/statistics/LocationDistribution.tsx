import { Application } from "@prisma/client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Applications",
    color: "hsl(var(--chart-primary))",
  },
} satisfies ChartConfig;

export default function LocationDistribution({
  applications,
}: {
  applications: Application[];
}) {
  const chartData = useMemo(() => {
    const locationCounts = applications.reduce(
      (accumolator, { location }) => {
        const normalizedLocation = location.trim();
        if (normalizedLocation) {
          accumolator[normalizedLocation] =
            (accumolator[normalizedLocation] || 0) + 1;
        }
        return accumolator;
      },
      {} as Record<string, number>,
    );
    return Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [applications]);

  return (
    <ChartContainer
      id="location-chart"
      config={chartConfig}
      className="my-4 max-h-[300px] rounded-2xl border bg-gray-100 pb-6 lg:w-3/4 dark:bg-gray-800"
    >
      <h1 className="mt-2 text-center text-xl font-bold">
        Location Distribution
      </h1>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 10,
          right: 10,
          top: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="location"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          angle={0}
          textAnchor="end"
        />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill={chartConfig.count.color} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
