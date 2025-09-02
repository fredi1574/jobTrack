import { generateChartDataByDate } from "@/lib/chart.utils";
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
    color: "#1E90FF",
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
      <LineChart
        data={chartData}
        margin={{
          top: 0,
          right: 5,
          left: -20,
          bottom: 0,
        }}
      >
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
