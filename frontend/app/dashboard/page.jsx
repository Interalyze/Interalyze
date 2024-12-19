
//  WITH SHADCN SIDEBAR
"use client";

import React, { useState, useRef, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
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
import { BarChart as ReBarChart, Bar, XAxis as ReXAxis, YAxis as ReYAxis } from "recharts";
import { SidebarLayout } from "@/components/sidebar-layout";

const transcript = [
  {
    question: "So how are you doing?",
    answer: "I'm pretty good.",
    startTime: 0,
    endTime: 5,
  },
  {
    question: "Ok well so please tell me about yourself.",
    answer:
      "Ok uhm so have you looked at my resume or should I alright so I guess ah I am course 6-7 here at M.I.T ah which is computational biology...",
    startTime: 6,
    endTime: 60,
  },
  {
    question: "So please tell me about a time that you demonstrated leadership.",
    answer:
      "Ok uhm one of the things we have to do for Camp Kesem is fundraise all the money to run the camp which is over $50,000. Ah so one of the things that I individually spearhead every year is called the Camp Kesem date auction...",
    startTime: 61,
    endTime: 102,
  },
  {
    question:
      "Tell me about a time when you were working on a team and faced with a challenge, how did you solve that problem?",
    answer:
      "Ahh I guess the easiest team project I had was last semester, uhm I worked on this six double o five project which is algorithm or software architecture. And we were put in a group of 3 people and it was standard you know we signed the contract everyone is supposed to work equally but it ended up being by the end of it that someone didn't like put their fair share of work in... Ah essentially we talked to him we didn't really get it out we actually had to go to some of the T.A's we got a little bit ah and that kinda like pushed him forward so I mean I guess what I am showing is like I'm not afraid to go to the right method or like authority like where in cases this situation presents itself.",
    startTime: 103,
    endTime: 150,
  },
  {
    question: "Oh yes. Alright tell me about one of your weaknesses and how you plan to overcome it.",
    answer:
      "Uhmmm. I would say for this job ah I'm a little technically underprepared. Ah I've only taken the introductory software classes so far and as well as introductory bio classes but I think just from sheer interest and sheer effort I will be able to kinda overcome these obstacles.",
    startTime: 151,
    endTime: 180,
  },
  {
    question: "Now why do you think we should hire you?",
    answer:
      "Ah I'm very interested in the subject of computation biology and I think that I will be able to contribute a lot to this field uhm I've had a good amount of experience and I think I will be a solid intern.",
    startTime: 181,
    endTime: 197,
  },
];

const personalityChartConfig = {
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

export default function Dashboard() {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stressChartData, setStressChartData] = useState([]);
  const [personalityChartData, setPersonalityChartData] = useState([]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const currentAnswer = transcript[currentIndex]?.answer;

      if (!currentAnswer) return;

      try {
        const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: [currentAnswer] }),
        });
        const stressResult = await stressResponse.json();

        const personalityResponse = await fetch(
          "http://127.0.0.1:8000/api/analyze-personality/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: [currentAnswer] }),
          }
        );
        const personalityResult = await personalityResponse.json();

        setStressChartData((prevData) => [
          ...prevData,
          {
            question: `Q${currentIndex + 1}`,
            confidence: stressResult.stress_analysis?.[0]?.confidence || 0,
            status:
              stressResult.stress_analysis?.[0]?.confidence > 0.5
                ? "Stressed"
                : "Not Stressed",
          },
        ]);

        setPersonalityChartData([
          {
            question: `Q${currentIndex + 1}`,
            openness: personalityResult.personality_scores?.[0]?.openness || 0,
            agreeableness: personalityResult.personality_scores?.[0]?.agreeableness || 0,
            conscientiousness:
              personalityResult.personality_scores?.[0]?.conscientiousness || 0,
            extraversion: personalityResult.personality_scores?.[0]?.extraversion || 0,
            neuroticism: personalityResult.personality_scores?.[0]?.neuroticism || 0,
          },
        ]);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      }
    };

    if (currentIndex < transcript.length) {
      fetchAnalysis();
    }
  }, [currentIndex]);

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime;
    if (!currentTime) return;

    const currentSegmentIndex = transcript.findIndex(
      (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
    );

    if (currentSegmentIndex !== -1 && currentSegmentIndex !== currentIndex) {
      setCurrentIndex(currentSegmentIndex);
    }
  };

  return (
    <SidebarLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Interview Analysis Dashboard</h1>

        {/* Video Player */}
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Video</CardTitle>
              <CardDescription>
                Watch the interview and analyze stress and personality metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <video
                ref={videoRef}
                width="640"
                height="360"
                controls
                className="border rounded"
                onTimeUpdate={handleTimeUpdate}
              >
                <source src="/P1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="mt-4">
                <p>
                  <strong>Current Question:</strong>{" "}
                  {transcript[currentIndex]?.question || "All questions analyzed."}
                </p>
                <p>
                  <strong>Current Answer:</strong>{" "}
                  {transcript[currentIndex]?.answer || "All answers analyzed."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stress Analysis Chart */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Stress Analysis</CardTitle>
              <CardDescription>
                Real-time stress confidence scores with stress status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                width={600}
                height={300}
                data={stressChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis domain={[0, 1]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 bg-white border rounded shadow">
                          <p>
                            <strong>Question:</strong> {data.question}
                          </p>
                          <p>
                            <strong>Status:</strong> {data.status}
                          </p>
                          <p>
                            <strong>Confidence:</strong>{" "}
                            {(data.confidence * 100).toFixed(2)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Stress Confidence"
                />
              </AreaChart>
            </CardContent>
          </Card>
        </div>

        {/* Personality Analysis Chart - Current Question Only */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Personality Analysis (Current Question)</CardTitle>
              <CardDescription>
                Personality traits for the current question.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={personalityChartConfig}>
                <ReBarChart
                  data={personalityChartData}
                  layout="vertical"
                  margin={{ left: 0 }}
                  width={600}
                  height={100}
                >
                  <ReYAxis
                    dataKey="question"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />
                  <ReXAxis type="number" domain={[0, 1]} />
                  <ChartTooltip
                    cursor={{ fill: "transparent" }}
                    content={<ChartTooltipContent hideLabel={false} />}
                  />
                  <Bar
                    dataKey="openness"
                    fill={personalityChartConfig.openness.color}
                    radius={5}
                  />
                  <Bar
                    dataKey="agreeableness"
                    fill={personalityChartConfig.agreeableness.color}
                    radius={5}
                  />
                  <Bar
                    dataKey="conscientiousness"
                    fill={personalityChartConfig.conscientiousness.color}
                    radius={5}
                  />
                  <Bar
                    dataKey="extraversion"
                    fill={personalityChartConfig.extraversion.color}
                    radius={5}
                  />
                  <Bar
                    dataKey="neuroticism"
                    fill={personalityChartConfig.neuroticism.color}
                    radius={5}
                  />
                </ReBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Personality traits updated for the current question <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Scores range from 0 to 1 for each trait.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}

//  WITH SIDEBAR
// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { TrendingUp } from "lucide-react";
// import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { BarChart as ReBarChart, Bar, XAxis as ReXAxis, YAxis as ReYAxis } from "recharts";
// import { SidebarLayout } from "@/components/sidebar-layout";

// const transcript = [
//   {
//     question: "So how are you doing?",
//     answer: "I'm pretty good.",
//     startTime: 0,
//     endTime: 5,
//   },
//   {
//     question: "Ok well so please tell me about yourself.",
//     answer:
//       "Ok uhm so have you looked at my resume or should I alright so I guess ah I am course 6-7 here at M.I.T ah which is computational biology...",
//     startTime: 6,
//     endTime: 60,
//   },
//   {
//     question: "So please tell me about a time that you demonstrated leadership.",
//     answer:
//       "Ok uhm one of the things we have to do for Camp Kesem is fundraise all the money to run the camp which is over $50,000. Ah so one of the things that I individually spearhead every year is called the Camp Kesem date auction...",
//     startTime: 61,
//     endTime: 102,
//   },
//   {
//     question:
//       "Tell me about a time when you were working on a team and faced with a challenge, how did you solve that problem?",
//     answer:
//       "Ahh I guess the easiest team project I had was last semester, uhm I worked on this six double o five project which is algorithm or software architecture. And we were put in a group of 3 people and it was standard you know we signed the contract everyone is supposed to work equally but it ended up being by the end of it that someone didn't like put their fair share of work in... Ah essentially we talked to him we didn't really get it out we actually had to go to some of the T.A's we got a little bit ah and that kinda like pushed him forward so I mean I guess what I am showing is like I'm not afraid to go to the right method or like authority like where in cases this situation presents itself.",
//     startTime: 103,
//     endTime: 150,
//   },
//   {
//     question: "Oh yes. Alright tell me about one of your weaknesses and how you plan to overcome it.",
//     answer:
//       "Uhmmm. I would say for this job ah I'm a little technically underprepared. Ah I've only taken the introductory software classes so far and as well as introductory bio classes but I think just from sheer interest and sheer effort I will be able to kinda overcome these obstacles.",
//     startTime: 151,
//     endTime: 180,
//   },
//   {
//     question: "Now why do you think we should hire you?",
//     answer:
//       "Ah I'm very interested in the subject of computation biology and I think that I will be able to contribute a lot to this field uhm I've had a good amount of experience and I think I will be a solid intern.",
//     startTime: 181,
//     endTime: 197,
//   },
// ];

// const personalityChartConfig = {
//   openness: {
//     label: "Openness",
//     color: "hsl(var(--chart-1))",
//   },
//   agreeableness: {
//     label: "Agreeableness",
//     color: "hsl(var(--chart-2))",
//   },
//   conscientiousness: {
//     label: "Conscientiousness",
//     color: "hsl(var(--chart-3))",
//   },
//   extraversion: {
//     label: "Extraversion",
//     color: "hsl(var(--chart-4))",
//   },
//   neuroticism: {
//     label: "Neuroticism",
//     color: "hsl(var(--chart-5))",
//   },
// };

// export default function Dashboard() {
//   const videoRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [stressChartData, setStressChartData] = useState([]);
//   const [personalityChartData, setPersonalityChartData] = useState([]);

//   useEffect(() => {
//     const fetchAnalysis = async () => {
//       const currentAnswer = transcript[currentIndex]?.answer;

//       if (!currentAnswer) return;

//       try {
//         const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ texts: [currentAnswer] }),
//         });
//         const stressResult = await stressResponse.json();

//         const personalityResponse = await fetch(
//           "http://127.0.0.1:8000/api/analyze-personality/",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ texts: [currentAnswer] }),
//           }
//         );
//         const personalityResult = await personalityResponse.json();

//         setStressChartData((prevData) => [
//           ...prevData,
//           {
//             question: `Q${currentIndex + 1}`,
//             confidence: stressResult.stress_analysis?.[0]?.confidence || 0,
//             status:
//               stressResult.stress_analysis?.[0]?.confidence > 0.5
//                 ? "Stressed"
//                 : "Not Stressed",
//           },
//         ]);

//         setPersonalityChartData([
//           {
//             question: `Q${currentIndex + 1}`,
//             openness: personalityResult.personality_scores?.[0]?.openness || 0,
//             agreeableness: personalityResult.personality_scores?.[0]?.agreeableness || 0,
//             conscientiousness:
//               personalityResult.personality_scores?.[0]?.conscientiousness || 0,
//             extraversion: personalityResult.personality_scores?.[0]?.extraversion || 0,
//             neuroticism: personalityResult.personality_scores?.[0]?.neuroticism || 0,
//           },
//         ]);
//       } catch (error) {
//         console.error("Error fetching analysis:", error);
//       }
//     };

//     if (currentIndex < transcript.length) {
//       fetchAnalysis();
//     }
//   }, [currentIndex]);

//   const handleTimeUpdate = () => {
//     const currentTime = videoRef.current?.currentTime;
//     if (!currentTime) return;

//     const currentSegmentIndex = transcript.findIndex(
//       (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
//     );

//     if (currentSegmentIndex !== -1 && currentSegmentIndex !== currentIndex) {
//       setCurrentIndex(currentSegmentIndex);
//     }
//   };

//   return (
//     <SidebarLayout>
//       <div className="p-8">
//         <h1 className="text-2xl font-bold">Interview Analysis Dashboard</h1>

//         {/* Video Player */}
//         <div className="mt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Interview Video</CardTitle>
//               <CardDescription>
//                 Watch the interview and analyze stress and personality metrics.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <video
//                 ref={videoRef}
//                 width="640"
//                 height="360"
//                 controls
//                 className="border rounded"
//                 onTimeUpdate={handleTimeUpdate}
//               >
//                 <source src="/P1.mp4" type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <div className="mt-4">
//                 <p>
//                   <strong>Current Question:</strong>{" "}
//                   {transcript[currentIndex]?.question || "All questions analyzed."}
//                 </p>
//                 <p>
//                   <strong>Current Answer:</strong>{" "}
//                   {transcript[currentIndex]?.answer || "All answers analyzed."}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Stress Analysis Chart */}
//         <div className="mt-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Stress Analysis</CardTitle>
//               <CardDescription>
//                 Real-time stress confidence scores with stress status.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <AreaChart
//                 width={600}
//                 height={300}
//                 data={stressChartData}
//                 margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="question" />
//                 <YAxis domain={[0, 1]} />
//                 <Tooltip
//                   content={({ active, payload }) => {
//                     if (active && payload && payload.length) {
//                       const data = payload[0].payload;
//                       return (
//                         <div className="p-2 bg-white border rounded shadow">
//                           <p>
//                             <strong>Question:</strong> {data.question}
//                           </p>
//                           <p>
//                             <strong>Status:</strong> {data.status}
//                           </p>
//                           <p>
//                             <strong>Confidence:</strong>{" "}
//                             {(data.confidence * 100).toFixed(2)}%
//                           </p>
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="confidence"
//                   stroke="#8884d8"
//                   fill="#8884d8"
//                   name="Stress Confidence"
//                 />
//               </AreaChart>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Personality Analysis Chart - Current Question Only */}
//         <div className="mt-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Personality Analysis (Current Question)</CardTitle>
//               <CardDescription>
//                 Personality traits for the current question.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer config={personalityChartConfig}>
//                 <ReBarChart
//                   data={personalityChartData}
//                   layout="vertical"
//                   margin={{ left: 0 }}
//                   width={600}
//                   height={100}
//                 >
//                   <ReYAxis
//                     dataKey="question"
//                     type="category"
//                     tickLine={false}
//                     tickMargin={10}
//                     axisLine={false}
//                     tickFormatter={(value) => value}
//                   />
//                   <ReXAxis type="number" domain={[0, 1]} />
//                   <ChartTooltip
//                     cursor={{ fill: "transparent" }}
//                     content={<ChartTooltipContent hideLabel={false} />}
//                   />
//                   <Bar
//                     dataKey="openness"
//                     fill={personalityChartConfig.openness.color}
//                     radius={5}
//                   />
//                   <Bar
//                     dataKey="agreeableness"
//                     fill={personalityChartConfig.agreeableness.color}
//                     radius={5}
//                   />
//                   <Bar
//                     dataKey="conscientiousness"
//                     fill={personalityChartConfig.conscientiousness.color}
//                     radius={5}
//                   />
//                   <Bar
//                     dataKey="extraversion"
//                     fill={personalityChartConfig.extraversion.color}
//                     radius={5}
//                   />
//                   <Bar
//                     dataKey="neuroticism"
//                     fill={personalityChartConfig.neuroticism.color}
//                     radius={5}
//                   />
//                 </ReBarChart>
//               </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col items-start gap-2 text-sm">
//               <div className="flex gap-2 font-medium leading-none">
//                 Personality traits updated for the current question <TrendingUp className="h-4 w-4" />
//               </div>
//               <div className="leading-none text-muted-foreground">
//                 Scores range from 0 to 1 for each trait.
//               </div>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </SidebarLayout>
//   );
// }


//  WITHOUT SIDE BAR
// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { TrendingUp } from "lucide-react";
// import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { BarChart as ReBarChart, Bar, XAxis as ReXAxis, YAxis as ReYAxis } from "recharts";

// const transcript = [
//   {
//     question: "So how are you doing?",
//     answer: "I'm pretty good.",
//     startTime: 0,
//     endTime: 5,
//   },
//   {
//     question: "Ok well so please tell me about yourself.",
//     answer:
//       "Ok uhm so have you looked at my resume or should I alright so I guess ah I am course 6-7 here at M.I.T ah which is computational biology...",
//     startTime: 6,
//     endTime: 60,
//   },
//   {
//     question: "So please tell me about a time that you demonstrated leadership.",
//     answer:
//       "Ok uhm one of the things we have to do for Camp Kesem is fundraise all the money to run the camp which is over $50,000. Ah so one of the things that I individually spearhead every year is called the Camp Kesem date auction...",
//     startTime: 61,
//     endTime: 102,
//   },
//   {
//     question:
//       "Tell me about a time when you were working on a team and faced with a challenge, how did you solve that problem?",
//     answer:
//       "Ahh I guess the easiest team project I had was last semester, uhm I worked on this six double o five project which is algorithm or software architecture. And we were put in a group of 3 people and it was standard you know we signed the contract everyone is supposed to work equally but it ended up being by the end of it that someone didn't like put their fair share of work in... Ah essentially we talked to him we didn't really get it out we actually had to go to some of the T.A's we got a little bit ah and that kinda like pushed him forward so I mean I guess what I am showing is like I'm not afraid to go to the right method or like authority like where in cases this situation presents itself.",
//     startTime: 103,
//     endTime: 150,
//   },
//   {
//     question: "Oh yes. Alright tell me about one of your weaknesses and how you plan to overcome it.",
//     answer:
//       "Uhmmm. I would say for this job ah I'm a little technically underprepared. Ah I've only taken the introductory software classes so far and as well as introductory bio classes but I think just from sheer interest and sheer effort I will be able to kinda overcome these obstacles.",
//     startTime: 151,
//     endTime: 180,
//   },
//   {
//     question: "Now why do you think we should hire you?",
//     answer:
//       "Ah I'm very interested in the subject of computation biology and I think that I will be able to contribute a lot to this field uhm I've had a good amount of experience and I think I will be a solid intern.",
//     startTime: 181,
//     endTime: 197,
//   },
// ];

// const personalityChartConfig = {
//   openness: {
//     label: "Openness",
//     color: "hsl(var(--chart-1))",
//   },
//   agreeableness: {
//     label: "Agreeableness",
//     color: "hsl(var(--chart-2))",
//   },
//   conscientiousness: {
//     label: "Conscientiousness",
//     color: "hsl(var(--chart-3))",
//   },
//   extraversion: {
//     label: "Extraversion",
//     color: "hsl(var(--chart-4))",
//   },
//   neuroticism: {
//     label: "Neuroticism",
//     color: "hsl(var(--chart-5))",
//   },
// }

// export default function Dashboard() {
//   const videoRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [stressChartData, setStressChartData] = useState([]);
//   const [personalityChartData, setPersonalityChartData] = useState([]);

//   useEffect(() => {
//     const fetchAnalysis = async () => {
//       const currentAnswer = transcript[currentIndex]?.answer;

//       if (!currentAnswer) return;

//       try {
//         // Stress Analysis API
//         const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ texts: [currentAnswer] }),
//         });
//         const stressResult = await stressResponse.json();

//         // Personality Analysis API
//         const personalityResponse = await fetch(
//           "http://127.0.0.1:8000/api/analyze-personality/",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ texts: [currentAnswer] }),
//           }
//         );
//         const personalityResult = await personalityResponse.json();

//         // Update stress chart data (append each question)
//         setStressChartData((prevData) => [
//           ...prevData,
//           {
//             question: `Q${currentIndex + 1}`,
//             confidence: stressResult.stress_analysis?.[0]?.confidence || 0,
//             status:
//               stressResult.stress_analysis?.[0]?.confidence > 0.5
//                 ? "Stressed"
//                 : "Not Stressed",
//           },
//         ]);

//         // Update personality chart data for the current question only (no accumulation)
//         setPersonalityChartData([
//           {
//             question: `Q${currentIndex + 1}`,
//             openness: personalityResult.personality_scores?.[0]?.openness || 0,
//             agreeableness: personalityResult.personality_scores?.[0]?.agreeableness || 0,
//             conscientiousness:
//               personalityResult.personality_scores?.[0]?.conscientiousness || 0,
//             extraversion: personalityResult.personality_scores?.[0]?.extraversion || 0,
//             neuroticism: personalityResult.personality_scores?.[0]?.neuroticism || 0,
//           },
//         ]);
//       } catch (error) {
//         console.error("Error fetching analysis:", error);
//       }
//     };

//     if (currentIndex < transcript.length) {
//       fetchAnalysis();
//     }
//   }, [currentIndex]);

//   const handleTimeUpdate = () => {
//     const currentTime = videoRef.current?.currentTime;
//     if (!currentTime) return;

//     const currentSegmentIndex = transcript.findIndex(
//       (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
//     );

//     if (currentSegmentIndex !== -1 && currentSegmentIndex !== currentIndex) {
//       setCurrentIndex(currentSegmentIndex);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Interview Analysis Dashboard</h1>

//       {/* Video Player */}
//       <div className="mt-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Interview Video</CardTitle>
//             <CardDescription>
//               Watch the interview and analyze stress and personality metrics.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <video
//               ref={videoRef}
//               width="640"
//               height="360"
//               controls
//               className="border rounded"
//               onTimeUpdate={handleTimeUpdate}
//             >
//               <source src="/P1.mp4" type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <div className="mt-4">
//               <p>
//                 <strong>Current Question:</strong>{" "}
//                 {transcript[currentIndex]?.question || "All questions analyzed."}
//               </p>
//               <p>
//                 <strong>Current Answer:</strong>{" "}
//                 {transcript[currentIndex]?.answer || "All answers analyzed."}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Stress Analysis Chart */}
//       <div className="mt-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Stress Analysis</CardTitle>
//             <CardDescription>
//               Real-time stress confidence scores with stress status.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <AreaChart
//               width={600}
//               height={300}
//               data={stressChartData}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="question" />
//               <YAxis domain={[0, 1]} />
//               <Tooltip
//                 content={({ active, payload }) => {
//                   if (active && payload && payload.length) {
//                     const data = payload[0].payload;
//                     return (
//                       <div className="p-2 bg-white border rounded shadow">
//                         <p>
//                           <strong>Question:</strong> {data.question}
//                         </p>
//                         <p>
//                           <strong>Status:</strong> {data.status}
//                         </p>
//                         <p>
//                           <strong>Confidence:</strong>{" "}
//                           {(data.confidence * 100).toFixed(2)}%
//                         </p>
//                       </div>
//                     );
//                   }
//                   return null;
//                 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="confidence"
//                 stroke="#8884d8"
//                 fill="#8884d8"
//                 name="Stress Confidence"
//               />
//             </AreaChart>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Personality Analysis Chart - Shows only current question's data */}
//       <div className="mt-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Personality Analysis (Current Question)</CardTitle>
//             <CardDescription>
//               Personality traits for the current question.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ChartContainer config={personalityChartConfig}>
//               <ReBarChart
//                 data={personalityChartData}
//                 layout="vertical"
//                 margin={{ left: 0 }}
//                 width={600}
//                 height={100} // Just enough for one row
//               >
//                 <ReYAxis
//                   dataKey="question"
//                   type="category"
//                   tickLine={false}
//                   tickMargin={10}
//                   axisLine={false}
//                   tickFormatter={(value) => value}
//                 />
//                 <ReXAxis type="number" domain={[0, 1]} />
//                 <ChartTooltip
//                   cursor={{ fill: "transparent" }}
//                   content={<ChartTooltipContent hideLabel={false} />}
//                 />
//                 <Bar
//                   dataKey="openness"
//                   fill={personalityChartConfig.openness.color}
//                   radius={5}
//                 />
//                 <Bar
//                   dataKey="agreeableness"
//                   fill={personalityChartConfig.agreeableness.color}
//                   radius={5}
//                 />
//                 <Bar
//                   dataKey="conscientiousness"
//                   fill={personalityChartConfig.conscientiousness.color}
//                   radius={5}
//                 />
//                 <Bar
//                   dataKey="extraversion"
//                   fill={personalityChartConfig.extraversion.color}
//                   radius={5}
//                 />
//                 <Bar
//                   dataKey="neuroticism"
//                   fill={personalityChartConfig.neuroticism.color}
//                   radius={5}
//                 />
//               </ReBarChart>
//             </ChartContainer>
//           </CardContent>
//           <CardFooter className="flex-col items-start gap-2 text-sm">
//             <div className="flex gap-2 font-medium leading-none">
//               Personality traits updated for the current question <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="leading-none text-muted-foreground">
//               Scores range from 0 to 1 for each trait.
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
