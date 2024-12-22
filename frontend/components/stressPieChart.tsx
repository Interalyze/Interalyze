"use client";

import { Pie, PieChart, Cell, LabelList } from "recharts";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the data type for a question
type QuestionData = {
  question: string;
  stress: string; // "Stressed" or "Not Stressed"
};

interface StressPieChartProps {
  newQuestion?: QuestionData; // Optional prop for new question
  currentIndex: number; // Index of the current question
}

export function StressPieChart({ newQuestion, currentIndex }: StressPieChartProps) {
  const [stressData, setStressData] = useState<QuestionData[]>([]);

  useEffect(() => {
    if (newQuestion) {
      setStressData((prevData) => {
        const updatedData = [...prevData];
        updatedData[currentIndex] = {
          question: `Q${currentIndex + 1}`,
          stress: newQuestion.stress,
        };
        return updatedData;
      });
    }
  }, [newQuestion, currentIndex]);

  const processedData = Array.from({ length: currentIndex + 1 }, (_, index) => {
    return (
      stressData[index] || {
        question: `Q${index + 1}`,
        stress: "Not Stressed",
      }
    );
  });

  const chartData = processedData.map((item) => ({
    name: item.question,
    value: 1,
    stress: item.stress,
  }));

  return (
    <Card className="h-[21rem] w-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Stress Analysis</CardTitle>
        <CardDescription>Stress levels per question</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex justify-start items-start">
        <div className="w-[90%] h-[250px] max-w-[400px]">
          <PieChart width={400} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={0}
              outerRadius={100}
              labelLine={false}
            >
              <LabelList
                dataKey="name"
                position="inside"
                fill="white"
                fontSize={12}
              />
              {chartData.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    item.stress === "Not Stressed"
                      ? "hsl(var(--chart-green))"
                      : "hsl(var(--chart-red))"
                  }
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
