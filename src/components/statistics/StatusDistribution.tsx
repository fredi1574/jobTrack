"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Application } from "@prisma/client";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

const chartConfig = {
  applications: {
    label: "Applications",
  },
  Applied: {
    label: "Applied",
    color: "hsl(var(--chart-applied))",
  },
  Assessment: {
    label: "Assessment",
    color: "hsl(var(--chart-assessment))",
  },
  Interview: {
    label: "Interview",
    color: "hsl(var(--chart-interview))",
  },
  Offer: {
    label: "Offer",
    color: "hsl(var(--chart-offer))",
  },
  Rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-rejected))",
  },
} satisfies ChartConfig;

export default function StatusDistribution({
  applications,
}: {
  applications: Application[];
}) {
  const pieData = useMemo(() => {
    const statusCounts = applications.reduce(
      (acc, application) => {
        const status = application.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Transform the grouped data into the format recharts expects.
    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status,
      count: count,
    }));
  }, [applications]);

  return (
    <ChartContainer
      id="status-chart"
      config={chartConfig}
      className="my-4 aspect-square max-h-[300px] rounded-2xl border bg-gray-100 pb-6 lg:w-1/4 dark:bg-gray-800"
    >
      <h1 className="mt-2 text-center text-xl font-bold">
        Status Distribution
      </h1>
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          className="-translate-y-4 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
        <Pie
          data={pieData}
          nameKey="status" // The key for the label/name
          dataKey="count" // The key for the numerical value
        >
          {pieData.map((entry) => (
            <Cell
              key={`cell-${entry.status}`}
              fill={
                chartConfig[entry.status as keyof typeof chartConfig]?.color ||
                "hsl(var(--muted))"
              }
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
