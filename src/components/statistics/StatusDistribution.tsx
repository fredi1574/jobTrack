"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Application } from "@prisma/client";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

type ChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
  };
};

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--chart-primary))",
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
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
        />
        <Pie
          data={pieData}
          nameKey="status"
          dataKey="count"
        >
          {pieData.map((entry) => (
            <Cell
              key={`cell-${entry.status}`}
              fill={chartConfig[entry.status as keyof typeof chartConfig].color}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
