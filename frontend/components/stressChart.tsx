"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

type QuestionData = {
  question: string;
  stress: string;
  confidence: number; 
};

interface StressBarChartProps {
  allStressData: QuestionData[]; 
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-blue))",
  },
};

export function StressBarChart({ allStressData }: StressBarChartProps) {
  const processedData = allStressData.map((item, idx) => {
    const adjustedConfidence =
      item.stress === "Not Stressed"
        ? Math.max(100 - item.confidence, 5)
        : Math.max(100 + item.confidence, 5);

    return {
      question: `Q${idx + 1}`, 
      stress: item.stress,
      confidence: adjustedConfidence,
    };
  });

  return (
    <Card className="h-[21rem] w-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Stress Analysis</CardTitle>
        <CardDescription>Stress levels per question</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex justify-start items-center">
        <div className="w-[90%] h-[250px] max-w-[400px]">
          <ChartContainer config={chartConfig} className="max-h-[225px] min-w-[600px]">
            <BarChart width={400} height={250} data={processedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="question"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                type="number"
                domain={[0, 200]}
                ticks={[0, 100, 200]}
                tickFormatter={(value) => {
                  if (value === 0) return "Calm";
                  if (value === 100) return "Average";
                  if (value === 200) return "Stressed";
                  return "";
                }}
              />
              <Bar dataKey="confidence" radius={5}>
                {processedData.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      item.stress === "Not Stressed"
                        ? "hsl(var(--chart-green))"
                        : item.stress === "Stressed"
                        ? "hsl(var(--chart-red))"
                        : "hsl(var(--chart-gray))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
