"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the type for a question
type QuestionData = {
  question: string;
  stress: number; // 0 or 1
  confidence: number; // Positive number
};

const chartConfig: ChartConfig = {
  confidence: {
    label: "Confidence",
  },
};

interface StressBarChartProps {
  newQuestion?: QuestionData; // Optional prop for new question
}

export function StressBarChart({ newQuestion }: StressBarChartProps) {
  const [stressData, setStressData] = useState<QuestionData[]>([]);

  useEffect(() => {
    if (newQuestion) {
      setStressData((prevData) => [
        ...prevData,
        {
          ...newQuestion,
          confidence: newQuestion.stress === 1 ? -newQuestion.confidence : newQuestion.confidence,
        },
      ]);
    }
  }, [newQuestion]);

  return (
    <Card className="h-[21rem] w-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Stress Analysis</CardTitle>
        <CardDescription>Stress levels per question</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex justify-start items-start">
        <div className="w-[90%] h-[150px] max-w-[400px] max-h-[125px]">
          <ChartContainer config={chartConfig}>
            <BarChart
              width={400}
              height={150}
              data={stressData}
              margin={{ top: 0, right: 10, left: -30, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis domain={[-100, 100]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
              <Bar dataKey="confidence">
                <LabelList position="insideEnd" dataKey="question" fillOpacity={1} />
                {stressData.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      item.stress === 1
                        ? "hsl(var(--chart-red))"
                        : "hsl(var(--chart-green))"
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
