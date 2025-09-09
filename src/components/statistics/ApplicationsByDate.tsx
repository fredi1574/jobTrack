import { generateChartDataByDate } from "@/lib/chart.utils";
import { Application } from "@prisma/client";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    color: "hsl(var(--chart-date))",
  },
} satisfies ChartConfig;

export default function ApplicationsByDate({
  applications,
}: {
  applications: Application[];
}) {
  const chartData = useMemo(() => {
    return generateChartDataByDate(applications);
  }, [applications]);

  return (
    <ChartContainer
      id="applications-by-date-chart"
      config={chartConfig}
      className="w-full"
    >
      <AreaChart
        data={chartData}
        margin={{
          top: 0,
          right: 5,
          left: -20,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-date))"
              stopOpacity={1}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-date))"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
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
              formatter={undefined}
              color={undefined}
              nameKey={undefined}
              labelKey={undefined}
              labelClassName={undefined}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="count"
          fill="url(#fillCount)"
          stroke="var(--color-count)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
