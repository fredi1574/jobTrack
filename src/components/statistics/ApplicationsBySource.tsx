"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface ApplicationsBySourceProps {
  data: { source: string; count: number }[];
}

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const chartConfig = {
  count: {
    label: "Applications",
    color: "#abcdef",
  },
} satisfies ChartConfig;

export function ApplicationsBySource({ data }: ApplicationsBySourceProps) {
  return (
    <ChartContainer config={chartConfig} id={undefined} className={undefined}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 0, right: 5, left: -20, bottom: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="source"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 12)}
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
        <Bar dataKey="count" fill="var(--color-count)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
