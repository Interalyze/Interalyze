"use client";

import React, { useState, useRef, useEffect } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const transcript = [
  {
    question: "So how are you doing?",
    answer: "I'm pretty good.",
    startTime: 0,
    endTime: 5,
  },
  {
    question: "Tell me about yourself.",
    answer: "I am a course 6-7 student at MIT specializing in computational biology.",
    startTime: 6,
    endTime: 60,
  },
  // Add more transcript entries here...
];

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
        // Stress Analysis API
        const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: [currentAnswer] }),
        });
        const stressResult = await stressResponse.json();

        // Personality Analysis API
        const personalityResponse = await fetch(
          "http://127.0.0.1:8000/api/analyze-personality/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: [currentAnswer] }),
          }
        );
        const personalityResult = await personalityResponse.json();

        // Update stress chart data
        setStressChartData((prevData) => [
          ...prevData,
          {
            question: `Q${currentIndex + 1}`,
            confidence: stressResult.stress_analysis?.[0]?.confidence || 0,
            status: stressResult.stress_analysis?.[0]?.confidence > 0.5
              ? "Stressed"
              : "Not Stressed",
          },
        ]);

        // Update personality chart data
        setPersonalityChartData((prevData) => [
          ...prevData,
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
              <source src="/mock-video.mp4" type="video/mp4" />
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
              Real-time stress confidence scores during the interview with stress status.
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

      {/* Personality Analysis Chart */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Personality Analysis</CardTitle>
            <CardDescription>
              Personality traits for each question in the interview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              width={600}
              height={300}
              data={personalityChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="openness"
                stroke="#82ca9d"
                fill="#82ca9d"
                name="Openness"
              />
              <Area
                type="monotone"
                dataKey="agreeableness"
                stroke="#8884d8"
                fill="#8884d8"
                name="Agreeableness"
              />
              <Area
                type="monotone"
                dataKey="conscientiousness"
                stroke="#f6a500"
                fill="#f6a500"
                name="Conscientiousness"
              />
              <Area
                type="monotone"
                dataKey="extraversion"
                stroke="#ff6f61"
                fill="#ff6f61"
                name="Extraversion"
              />
              <Area
                type="monotone"
                dataKey="neuroticism"
                stroke="#6f42c1"
                fill="#6f42c1"
                name="Neuroticism"
              />
            </AreaChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



// en iyidsi
// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

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
//         const personalityResponse = await fetch("http://127.0.0.1:8000/api/analyze-personality/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ texts: [currentAnswer] }),
//         });

//         const personalityResult = await personalityResponse.json();

//         // Update stress chart data
//         setStressChartData((prevData) => [
//           ...prevData,
//           {
//             question: `Q${currentIndex + 1}`,
//             confidence: stressResult.stress_analysis?.[0]?.confidence || 0,
//           },
//         ]);

//         // Update personality chart data
//         setPersonalityChartData((prevData) => [
//           ...prevData,
//           {
//             question: `Q${currentIndex + 1}`,
//             openness: personalityResult.personality_scores?.[0]?.openness || 0,
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
//       <div className="mt-4">
//         <h2>Interview Video</h2>
//         <video
//           ref={videoRef}
//           width="640"
//           height="360"
//           controls
//           className="border rounded"
//           onTimeUpdate={handleTimeUpdate}
//         >
//           <source src="/mock-video.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         <div className="mt-4">
//           <p>
//             <strong>Current Question:</strong> {transcript[currentIndex]?.question || "All questions analyzed."}
//           </p>
//           <p>
//             <strong>Current Answer:</strong> {transcript[currentIndex]?.answer || "All answers analyzed."}
//           </p>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h2>Stress Analysis</h2>
//         <AreaChart
//           width={600}
//           height={300}
//           data={stressChartData}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="question" />
//           <YAxis domain={[0, 1]} />
//           <Tooltip />
//           <Area type="monotone" dataKey="confidence" stroke="#8884d8" fill="#8884d8" />
//         </AreaChart>
//       </div>

//       <div className="mt-8">
//         <h2>Personality Analysis</h2>
//         <AreaChart
//           width={600}
//           height={300}
//           data={personalityChartData}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="question" />
//           <YAxis domain={[0, 1]} />
//           <Tooltip />
//           <Area type="monotone" dataKey="openness" stroke="#82ca9d" fill="#82ca9d" />
//         </AreaChart>
//       </div>
//     </div>
//   );
// }


//  çalışıyo
// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// const transcript = [
//   {
//     question: "So how are you doing?",
//     answer: "I'm pretty good.",
//   },
//   {
//     question: "Ok well so please tell me about yourself.",
//     answer: "Ok uhm so have you looked at my resume or should I alright so I guess ah I am course 6-7 here at M.I.T ah which is computational biology so its a mix of computers science and biology and actually thats where my interest lie in applying like algorithmic kinda software engineering to datasets dealing with genomics and biology. Uhm some of the activities that I do outside of school include Camp Kesem which is a summer camp that we run for completely free for kids whose parents have cancer as well as ah amphibious achievement which is ah a high school tutoring program for inner city kids in Boston.",
//   },
//   {
//     question: "So please tell me about a time that you demonstrated leadership.",
//     answer: "Ok uhm one of the things we have to do for Camp Kesem is fundraise all the money to run the camp which is over $50,000. Ah so one of the things that I individually spearhead every year is called the Camp Kesem date auction where actually my fraternity and I go out and solicit uhm donations in the form of gift cards ah to raise money for a date auction where we actually sell dates and then we use this money obviously we donate it to Camp Kesem. I spearhead the entire event and I kinda organize everyone into committees and groups and I send the people out and make sure everything goes according to plan.",
//   },
//   {
//     question: "Tell me about a time when you were working on a team and faced with a challenge, how did you solve that problem?",
//     answer: "Ahh I guess the easiest team project I had was last semester, uhm I worked on this six double o five project which is algorithm or software architecture. And we were put in a group of 3 people and it was standard you know we signed the contract everyone is supposed to work equally but it ended up being by the end of it that someone didn't like put their fair share of work in... Ah essentially we talked to him we didn't really get it out we actually had to go to some of the T.A's we got a little bit ah and that kinda like pushed him forward so I mean I guess what I am showing is like I'm not afraid to go to the right method or like authority like where in cases this situation presents itself.",
//   },
//   {
//     question: "Oh yes. Alright tell me about one of your weaknesses and how you plan to overcome it.",
//     answer: "Uhmmm. I would say for this job ah I'm a little technically underprepared. Ah I've only taken the introductory software classes so far and as well as introductory bio classes but I think just from sheer interest and sheer effort I will be able to kinda overcome these obstacles.",
//   },
//   {
//     question: "Now why do you think we should hire you?",
//     answer: "Ah I'm very interested in the subject of computation biology and I think that I will be able to contribute a lot to this field uhm I've had a good amount of experience and I think I will be a solid intern.",
//   },
// ];

// export default function Dashboard() {
//   const videoRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [stressChartData, setStressChartData] = useState([]);
//   const [personalityChartData, setPersonalityChartData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchAnalysis = async () => {
//       const currentAnswer = transcript[currentIndex]?.answer;

//       if (!currentAnswer) return;

//       setIsLoading(true);

//       try {
//         // Stress Analysis API
//         const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ texts: [currentAnswer] }), // Expecting "texts" array
//         });
//         const stressResult = await stressResponse.json();

//         // Personality Analysis API
//         const personalityResponse = await fetch("http://127.0.0.1:8000/api/analyze-personality/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ texts: [currentAnswer] }), // Expecting "texts" array
//         });
//         const personalityResult = await personalityResponse.json();

//         // Update stress chart data
//         setStressChartData((prevData) => [
//           ...prevData,
//           {
//             question: `Q${currentIndex + 1}`,
//             confidence: stressResult.stress_analysis[0]?.confidence || 0,
//           },
//         ]);

//         // Update personality chart data
//         setPersonalityChartData((prevData) => [
//           ...prevData,
//           {
//             question: `Q${currentIndex + 1}`,
//             openness: personalityResult.personality_scores[0]?.openness || 0,
//           },
//         ]);
//       } catch (error) {
//         console.error("Error fetching analysis:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (currentIndex < transcript.length) {
//       fetchAnalysis();
//     }
//   }, [currentIndex]);

//   const handleNextQuestion = () => {
//     if (currentIndex < transcript.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handlePlayPause = () => {
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//     } else {
//       videoRef.current.pause();
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Interview Analysis Dashboard</h1>
//       <div className="mt-4">
//         <h2>Interview Video</h2>
//         <video
//           ref={videoRef}
//           width="640"
//           height="360"
//           controls
//           className="border rounded"
//         >
//           <source src="/mock-video.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         <br />
//         <button
//           onClick={handlePlayPause}
//           className="mt-2 p-2 bg-blue-500 text-white rounded"
//         >
//           Play/Pause
//         </button>
//         <button
//           onClick={handleNextQuestion}
//           className="ml-4 mt-2 p-2 bg-green-500 text-white rounded"
//         >
//           Next Question
//         </button>
//         <div className="mt-4">
//           <p>
//             <strong>Current Question:</strong>{" "}
//             {transcript[currentIndex]?.question || "All questions analyzed."}
//           </p>
//           <p>
//             <strong>Current Answer:</strong>{" "}
//             {transcript[currentIndex]?.answer || "All answers analyzed."}
//           </p>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h2>Stress Analysis</h2>
//         <AreaChart
//           width={600}
//           height={300}
//           data={stressChartData}
//           margin={{
//             top: 10,
//             right: 30,
//             left: 0,
//             bottom: 0,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="question" />
//           <YAxis domain={[0, 1]} /> {/* Set Y-axis range */}
//           <Tooltip />
//           <Area
//             type="monotone"
//             dataKey="confidence"
//             stroke="#8884d8"
//             fill="#8884d8"
//           />
//         </AreaChart>
//       </div>

//       <div className="mt-8">
//         <h2>Personality Analysis</h2>
//         <AreaChart
//           width={600}
//           height={300}
//           data={personalityChartData}
//           margin={{
//             top: 10,
//             right: 30,
//             left: 0,
//             bottom: 0,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="question" />
//           <YAxis domain={[0, 1]} /> {/* Set Y-axis range */}
//           <Tooltip />
//           <Area
//             type="monotone"
//             dataKey="openness"
//             stroke="#82ca9d"
//             fill="#82ca9d"
//           />
//         </AreaChart>
//       </div>

//       {isLoading && <p>Loading analysis...</p>}
//     </div>
//   );
// }


