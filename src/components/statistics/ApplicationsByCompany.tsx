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

export default function ApplicationsByCompany({
  applications,
}: {
  applications: Application[];
}) {
  const chartData = useMemo(() => {
    const companyCounts = applications.reduce(
      (accumulator, { company }) => {
        const normalizedCompany = company.trim();
        if (normalizedCompany) {
          accumulator[normalizedCompany] =
            (accumulator[normalizedCompany] || 0) + 1;
        }
        return accumulator;
      },
      {} as Record<string, number>,
    );
    return Object.entries(companyCounts)
      .map(([company, count]) => ({
        company,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [applications]);

  return (
    <ChartContainer
      id="applications-by-company-chart"
      config={chartConfig}
      className="my-4 max-h-[300px] w-full rounded-2xl border bg-gray-100 p-4 dark:bg-gray-800"
    >
      <h1 className="mt-2 text-center text-xl font-bold">
        Applications by Company
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
          dataKey="company"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          angle={-25}
          textAnchor="end"
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="count" fill={chartConfig.count.color} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
