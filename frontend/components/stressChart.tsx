"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Define the type for a question
type QuestionData = {
  question: string;
  stress: string; // "Not Stressed" or "Stressed"
  confidence: number; // Positive number
};

interface StressBarChartProps {
  newQuestion?: QuestionData; // Optional prop for new question
  currentIndex: number; // Index of the current question
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-blue))",
  },
};

export function StressBarChart({ newQuestion, currentIndex }: StressBarChartProps) {
  const [stressData, setStressData] = useState<QuestionData[]>([]);

  useEffect(() => {
    if (newQuestion) {
      setStressData((prevData) => {
        const updatedData = [...prevData];
        updatedData[currentIndex] = {
          question: `Q${currentIndex + 1}`,
          stress: newQuestion.stress,
          confidence:
            newQuestion.stress === "Not Stressed"
              ? Math.max(100 - newQuestion.confidence, 5)
              : Math.max(100 + newQuestion.confidence, 5),
        };
        return updatedData;
      });
    }
  }, [newQuestion, currentIndex]);

  const processedData = Array.from({ length: currentIndex + 1 }, (_, index) => {
    return (
      stressData[index] || {
        question: `Q${index + 1}`,
        stress: "Uninitialized",
        confidence: 2.5, // Default value for uninitialized data
      }
    );
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
            <BarChart
              width={400}
              height={250}
              data={processedData}
            >
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
                        : "hsl(var(--chart-gray))" // Gray for uninitialized data
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
