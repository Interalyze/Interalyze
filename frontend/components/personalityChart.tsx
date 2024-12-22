"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  openness: {
    label: "Openness",
    color: "hsl(var(--chart-1))",
  },
  agreeableness: {
    label: "Agreeableness",
    color: "hsl(var(--chart-2))",
  },
  conscientiousness: {
    label: "Conscientiousness",
    color: "hsl(var(--chart-3))",
  },
  extraversion: {
    label: "Extraversion",
    color: "hsl(var(--chart-4))",
  },
  neuroticism: {
    label: "Neuroticism",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface PersonalityBarChartProps {
  newTraits?: {
    openness?: number;
    agreeableness?: number;
    conscientiousness?: number;
    extraversion?: number;
    neuroticism?: number;
  };
}

export function PersonalityBarChart({ newTraits = {} }: PersonalityBarChartProps) {
  const [personalityData, setPersonalityData] = useState<
    { trait: string; confidence: number; fill: string }[]
  >([]);

  useEffect(() => {
    const validTraits = newTraits
      ? Object.entries(newTraits)
          .filter(([trait]) => chartConfig.hasOwnProperty(trait))
          .map(([trait, confidence]) => ({
            trait,
            confidence: confidence ?? 0,
            fill: chartConfig[trait as keyof typeof chartConfig]?.color || "hsl(var(--chart-default))",
          }))
      : [];

    setPersonalityData(validTraits);
  }, [newTraits]);

  return (
    <Card className="h-[21rem] w-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Personality Analysis</CardTitle>
        <CardDescription>Big Five Personality Traits</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex justify-start items-start">
        <div className="w-[90%] h-[150px] max-w-[400px] max-h-[125px]">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={personalityData}
              layout="vertical"
              margin={{
                left: 60,
              }}
            >
              <YAxis
                dataKey="trait"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
              <XAxis type="number" domain={[0, 1]} hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="confidence" layout="vertical" radius={5}>
                {personalityData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
