"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
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
};

interface PersonalityLineChartProps {
    personalityData: {
        time: number;
        openness?: number;
        agreeableness?: number;
        conscientiousness?: number;
        extraversion?: number;
        neuroticism?: number;
    }[];
}

export function PersonalityLineChart({ personalityData }: PersonalityLineChartProps) {
    const formattedData = useMemo(() => {
        return personalityData.map((dataPoint) => ({
            ...dataPoint,
            time: dataPoint.time,
        }));
    }, [personalityData]);

    return (
        <Card className="w-full h-[53rem]">
            <CardHeader>
                <CardTitle>Personality Traits Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} >
                    <div>
                        {Object.keys(chartConfig).map((key) => (
                            <div key={key} className="mb-6">
                                <h3 className="text-[12pt] mb-4">{chartConfig[key as keyof typeof chartConfig].label}</h3>
                                <LineChart 
                                    data={formattedData}
                                    margin={{
                                        left:-30,
                                        right: 24,
                                    }}
                                    width={600}
                                    height={100}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", offset: 0 }} />
                                    <YAxis domain={[0, 1]} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey={key}
                                        stroke={chartConfig[key as keyof typeof chartConfig].color}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </div>
                        ))}
                    </div>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
