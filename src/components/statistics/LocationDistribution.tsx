import { Application } from "@prisma/client";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    color: "#EF4444",
  },
} satisfies ChartConfig;

export default function LocationDistribution({
  applications,
}: {
  applications: Application[];
}) {
  const chartData = useMemo(() => {
    const locationCounts = applications.reduce(
      (accumulator, { location }) => {
        const normalizedLocation = location.trim();
        if (normalizedLocation) {
          accumulator[normalizedLocation] =
            (accumulator[normalizedLocation] || 0) + 1;
        }
        return accumulator;
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
      className="max-h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 0,
          right: 5,
          left: -20,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="location"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          angle={-15}
          textAnchor="end"
        />
        <YAxis allowDecimals={false} />
        <ChartTooltip
          cursor={true}
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
        <Bar dataKey="count" fill={chartConfig.count.color} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
