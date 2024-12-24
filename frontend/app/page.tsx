"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SidebarLayout from "@/components/sidebarlayout";
import { StressBarChart } from "@/components/stressChart";
import { StressPieChart } from "@/components/stressPieChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PersonalityBarChart } from "@/components/personalityChart";

interface StressData {
  question: string;
  stress: string;
  confidence: number;
}

interface PersonalityData {
  question: string;
  openness: number;
  agreeableness: number;
  conscientiousness: number;
  extraversion: number;
  neuroticism: number;
}

interface SkillData {
  skill_name: string;
  confidence: number;
}

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [personalityChartData, setPersonalityChartData] = useState<
    PersonalityData[]
  >([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [newQuestion, setNewQuestion] = useState<StressData | undefined>(undefined);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const answersOnly = transcript.map((item) => item.answer).join(" ");
        const skillsResponse = await fetch(
          "http://127.0.0.1:8000/api/skills-analysis/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: answersOnly }),
          }
        );

        const skillsResult = await skillsResponse.json();

        console.log("skills: "+ skillsResult.extracted_skills)
        setSkills(skillsResult.extracted_skills || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const currentAnswer = transcript[currentIndex]?.answer;

      if (!currentAnswer) return;

      try {
        const stressResponse = await fetch(
          "http://127.0.0.1:8000/api/analyze-stress/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: [currentAnswer] }),
          }
        );
        const stressResult = await stressResponse.json();

        const stressData: StressData = {
          question: `Q${currentIndex + 1}`,
          stress: stressResult.stress_analysis?.[0]?.stress_level,
          confidence: (stressResult.stress_analysis?.[0]?.confidence * 100),
        };

        setNewQuestion(stressData);

        const personalityResponse = await fetch(
          "http://127.0.0.1:8000/api/analyze-personality/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: [currentAnswer] }),
          }
        );
        
        const personalityResult = await personalityResponse.json();

        setPersonalityChartData((prevData) => [
          ...prevData,
          {
            question: `Q${currentIndex + 1}`,
            openness: personalityResult.personality_scores?.[0]?.openness || 0,
            agreeableness:
              personalityResult.personality_scores?.[0]?.agreeableness || 0,
            conscientiousness:
              personalityResult.personality_scores?.[0]?.conscientiousness || 0,
            extraversion:
              personalityResult.personality_scores?.[0]?.extraversion || 0,
            neuroticism:
              personalityResult.personality_scores?.[0]?.neuroticism || 0,
          },
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
    const transcriptCard = document.getElementById("transcript-card");
    if (currentElement && transcriptCard) {
      const { offsetTop } = currentElement as HTMLElement;
      transcriptCard.scrollTo({
        top: offsetTop - transcriptCard.offsetTop,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const handleTranscriptClick = (index: number) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.currentTime = transcript[index].startTime;
    }
    setCurrentIndex(index);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;

    const segmentIndex = transcript.findIndex(
      (segment) =>
        currentTime >= segment.startTime && currentTime <= segment.endTime
    );

    if (segmentIndex !== -1 && segmentIndex !== currentIndex) {
      setCurrentIndex(segmentIndex);
    }
  };

  return (
    <SidebarLayout>
      <main className="flex-1 bg-gray-100 p-6">
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
            <BreadcrumbItem>
              <span aria-current="page">Transcript Analysis</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-12">
          <div className="space-y-6">
            <Card className="h-[21rem] w-full">
              <CardContent className="bg-black h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  controls
                  className="w-full h-full"
                >
                  <source src="/videos/P1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>

            <PersonalityBarChart
              newTraits={personalityChartData[currentIndex]}
            />

            <StressBarChart newQuestion={newQuestion} currentIndex={currentIndex} />
          </div>

          <div className="space-y-6">
            <Card className="h-[10.5rem] w-full">
              <CardHeader>
                <CardTitle>Person Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Details about the person go here.</p>
              </CardContent>
            </Card>
            <Card className="h-[31.5rem] w-full">
  <CardHeader>
    <CardTitle>Transcript</CardTitle>
  </CardHeader>
  <CardContent
    className="overflow-y-auto h-full"
    id="transcript-card"
    style={{
      maxHeight: 'calc(100% - 4rem)', // Adjust height to accommodate the header
    }}
  >
    {transcript.map((segment, index) => (
      <div
        key={index}
        className={`mb-4 ${
          index <= currentIndex ? "font-bold" : "font-normal"
        }`}
        id={`transcript-item-${index}`}
        onClick={() => handleTranscriptClick(index)}
        style={{ cursor: "pointer" }}
      >
        <p>
          <span className="text-gray-600">Question: </span>
          {segment.question}
        </p>
        <p>
          <span className="text-gray-600">Answer: </span>
          {segment.answer}
        </p>
      </div>
    ))}
  </CardContent>
</Card>
          </div>
        </div>

        <div className="mt-6 h-[4rem] w-full col-span-2 flex items-center gap-4">
          <span className="text-lg font-semibold">Skills:</span>
          <Card className="flex-1 h-[4rem] flex items-center">
          <CardContent className="flex items-center gap-4 flex-wrap w-full p-0 pl-4">
  {skills
    .filter((skill) => skill.skill_name.length >= 3) // Exclude skills with names shorter than 3 characters
    .sort((a, b) => b.confidence - a.confidence) // Sort by confidence in descending order
    .map((skill, index) => (
      <Badge
        className="h-[2rem]"
        key={index}
        variant="secondary"
        style={{ opacity: Math.max(0.5, skill.confidence) }} // Ensure visibility with a minimum opacity
      >
        {skill.skill_name || "Unknown Skill"}
      </Badge>
    ))}
</CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}