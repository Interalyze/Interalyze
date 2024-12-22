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
  stress: string; // 0 or 1
  confidence: number; // Positive number
};

const chartConfig: ChartConfig = {
  confidence: {
    label: "Confidence",
  },
};

interface StressBarChartProps {
  newQuestion?: QuestionData; // Optional prop for new question
  currentIndex: number; // Index of the current question
}

export function StressBarChart({ newQuestion, currentIndex }: StressBarChartProps) {
  const [stressData, setStressData] = useState<QuestionData[]>([]);

  useEffect(() => {
    if (newQuestion) {
      setStressData((prevData) => {
        const updatedData = [...prevData];
        console.log("New Confidence:", updatedData[currentIndex]);
        updatedData[currentIndex] = {
          question: `Q${currentIndex + 1}`,
          stress: newQuestion.stress,
        
          confidence:
            newQuestion.stress == "Not Stressed" ? newQuestion.confidence: -newQuestion.confidence ,
        };
        return updatedData;
      });
    }
  }, [newQuestion, currentIndex]);

  const processedData = Array.from({ length: currentIndex + 1 }, (_, index) => {
    return (
      stressData[index] || {
        question: `Q${index + 1}`,
        stress: 0,
        confidence: 0,
      }
    );
  });

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
              data={processedData}
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
                {processedData.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      item.stress == "Not Stressed"
                        ? "hsl(var(--chart-green))"
                        : "hsl(var(--chart-red))"
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
