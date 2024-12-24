"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

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

interface PersonalityDataPoint {
  time: number;
  openness?: number;
  agreeableness?: number;
  conscientiousness?: number;
  extraversion?: number;
  neuroticism?: number;
}

interface PersonalityLineChartProps {
  personalityData: PersonalityDataPoint[];
}

/**
 * Custom tooltip component that displays the hovered trait, time, and confidence.
 */
function CustomTooltip({
  active,
  payload,
  label,
  traitLabel,
}: TooltipProps<any, any> & { traitLabel: string }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0].value;
  return (
    <div className="p-2 text-sm bg-white border shadow-sm">
      <p className="font-semibold">{traitLabel}</p>
      <p>Ratio: {value.toFixed(2)}</p>
    </div>
  );
}

export function PersonalityLineChart({ personalityData }: PersonalityLineChartProps) {
  const formattedData = useMemo(
    () =>
      personalityData.map((dataPoint) => ({
        ...dataPoint,
        time: dataPoint.time,
      })),
    [personalityData]
  );

  return (
    <Card className="w-full h-[53rem]">
      <CardHeader>
        <CardTitle>Personality Traits Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <div>
            {Object.keys(chartConfig).map((key) => {
              const { label, color } = chartConfig[key as keyof typeof chartConfig];
              return (
                <div key={key} className="mb-6">
                  <h3 className="text-[12pt] mb-4">{label}</h3>
                  <LineChart
                    data={formattedData}
                    margin={{ left: -30, right: 24 }}
                    width={600}
                    height={100}
                    /**
                     * Give each chart the same syncId so they all
                     * highlight the same index on hover.
                     */
                    syncId="personalitySync"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      label={{ value: "Time (s)", position: "insideBottom", offset: 0 }}
                    />
                    <YAxis domain={[0, 1]} />
                    <Tooltip
                      content={<CustomTooltip traitLabel={label} />}
                    />
                    <Line
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </div>
              );
            })}
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


/*"use client";

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
*/
