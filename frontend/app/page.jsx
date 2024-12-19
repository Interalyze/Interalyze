"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SidebarLayout from "@/components/sidebarlayout";
import { StressBarChart } from "@/components/stressChart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator } from "@/components/ui/breadcrumb"; // Import Breadcrumb components
import { PersonalityBarChart } from "@/components/personalityChart";

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

export default function CandidateDashboard() {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [personalityChartData, setPersonalityChartData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newQuestion, setNewQuestion] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const currentAnswer = transcript[currentIndex]?.answer;

      if (!currentAnswer) return;

      try {
        // Stress Analysis API
        const stressResponse = await fetch(
          "http://127.0.0.1:8000/api/analyze-stress/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: [currentAnswer] }),
          }
        );
        const stressResult = await stressResponse.json();

        // Extract stress data
        const stressData = {
          question: `Q${currentIndex + 1}`,
          stress: stressResult.stress_analysis?.[0]?.confidence > 0.5 ? 1 : 0,
          confidence: Math.round(
            (stressResult.stress_analysis?.[0]?.confidence || 0) * 100
          ),
        };

        // Pass stress data to the chart
        setNewQuestion(stressData);

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

        // Update personality chart data
        setPersonalityChartData((prevData) => [
          ...prevData,
          {
            question: `Q${currentIndex + 1}`,
            openness: personalityResult.personality_scores?.[0]?.openness || 0,
            agreeableness:
              personalityResult.personality_scores?.[0]?.agreeableness || 0,
            conscientiousness:
              personalityResult.personality_scores?.[0]?.conscientiousness ||
              0,
            extraversion:
              personalityResult.personality_scores?.[0]?.extraversion || 0,
            neuroticism:
              personalityResult.personality_scores?.[0]?.neuroticism || 0,
          },
        ]);

        // Update skills
        setSkills([
          "Teamwork",
          "Discipline",
          "React",
          "Django",
          "C++",
          "Python",
          ...(personalityResult.skills || []),
        ]);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      }
    };

    if (currentIndex < transcript.length) {
      fetchAnalysis();
    }

    const currentElement = document.querySelector(
      `#transcript-item-${currentIndex}`
    );
    currentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime;
    if (!currentTime) return;

    const currentSegmentIndex = transcript.findIndex(
      (segment) =>
        currentTime >= segment.startTime && currentTime <= segment.endTime
    );

    if (currentSegmentIndex !== -1 && currentSegmentIndex !== currentIndex) {
      setCurrentIndex(currentSegmentIndex);
    }
  };

  return (
    <SidebarLayout>
      <main className="flex-1 bg-gray-100 p-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/candidates">Candidates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem isCurrent>
              <BreadcrumbLink href="#">Transcript Analysis</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-12">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Video Hosting */}
            <Card className="h-[21rem]  w-full">
              <CardContent className="bg-black h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  controls
                  className="w-full h-full"
                >
                  <source src="/path-to-video.mp4" type="video/mp4" />
                </video>
              </CardContent>
            </Card>

            {/* Stress Bar Chart */}
            <StressBarChart newQuestion={newQuestion} />

            {/* Personality Traits */}
            <PersonalityBarChart
              newTraits={personalityChartData[currentIndex]}/>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Person Details */}
            <Card className="h-[10.5rem]  w-full">
              <CardHeader>
                <CardTitle>Person Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Details about the person go here.</p>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="h-[54rem] w-full">
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto h-[50rem]">
                {transcript.map((segment, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      index <= currentIndex ? "font-bold" : "font-normal"
                    }`}
                  >
                    <p>
                      <span className="text-gray-600">Q: </span>
                      {segment.question}
                    </p>
                    <p>
                      <span className="text-gray-600">A: </span>
                      {segment.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Card */}
        <Card className="mt-6 h-[4rem] w-full col-span-2">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </main>
    </SidebarLayout>
  );
}
