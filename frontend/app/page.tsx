"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SidebarLayout from "@/components/sidebarlayout";
import { StressBarChart } from "@/components/stressChart"; // <--- Updated usage
import { StressPieChart } from "@/components/stressPieChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PersonalityBarChart } from "@/components/personalityChart";
import { PersonalityLineChart } from "@/components/personalityLineCharts";

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

const skillBadgeColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function CandidateDashboard() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [personalityChartData, setPersonalityChartData] = useState<PersonalityData[]>([]);

  const [allStressData, setAllStressData] = useState<StressData[]>([]);

  const [skills, setSkills] = useState<SkillData[]>([]);

  const personalityLineData = useMemo(() => {
    return personalityChartData.map((data, index) => ({
      time: transcript[index]?.startTime ?? index * 10,
      ...data,
    }));
  }, [personalityChartData]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const answersOnly = transcript.map((item) => item.answer).join(" ");
        const skillsResponse = await fetch("http://127.0.0.1:8000/api/skills-analysis/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: answersOnly }),
        });

        const skillsResult = await skillsResponse.json();
        setSkills(skillsResult.extracted_skills || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchPersonalityForAnswer = async (answer: string) => {
      const response = await fetch("http://127.0.0.1:8000/api/analyze-personality/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: [answer] }),
      });
      const data = await response.json();
      return data.personality_scores?.[0] || null;
    };

    const analyzeAllQuestionsInSuccession = async () => {
      const newData: PersonalityData[] = [];

      for (let i = 0; i < transcript.length; i++) {
        const { answer } = transcript[i];

        try {
          const result = await fetchPersonalityForAnswer(answer);
          if (result) {
            newData.push({
              question: `Q${i + 1}`,
              openness: result.openness || 0,
              agreeableness: result.agreeableness || 0,
              conscientiousness: result.conscientiousness || 0,
              extraversion: result.extraversion || 0,
              neuroticism: result.neuroticism || 0,
            });

            setPersonalityChartData([...newData]);
          }
        } catch (err) {
          console.error(`Error analyzing personality for Q${i + 1}:`, err);
        }
      }
    };

    analyzeAllQuestionsInSuccession();
  }, []);
  useEffect(() => {
    const fetchAllStressData = async () => {
      try {
        const allAnswers = transcript.map((item) => item.answer);

        const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: allAnswers }),
        });
        const stressResult = await stressResponse.json();

        const newStressData: StressData[] = stressResult.stress_analysis.map(
          (analysis: any, i: number) => ({
            question: `Q${i + 1}`,
            stress: analysis?.stress_level || "Unknown",
            confidence: (analysis?.confidence ?? 0) * 100, 
          })
        );

        setAllStressData(newStressData);
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
        console.error("Error fetching all stress data:", error);
      }
    };

    fetchAllStressData();
  }, []);
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;

    const segmentIndex = transcript.findIndex(
      (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
    );

    if (segmentIndex !== -1 && segmentIndex !== currentIndex) {
      setCurrentIndex(segmentIndex);
    }
  };
  const handleTranscriptClick = (index: number) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.currentTime = transcript[index].startTime;
    }
    setCurrentIndex(index);
  };
  useEffect(() => {
    const currentElement = document.querySelector(`#transcript-item-${currentIndex}`);
    const transcriptCard = document.getElementById("transcript-card");
    if (currentElement && transcriptCard) {
      const { offsetTop } = currentElement as HTMLElement;
      transcriptCard.scrollTo({
        top: offsetTop - transcriptCard.offsetTop,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

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

            <PersonalityLineChart personalityData={personalityLineData} />
          </div>

          <div className="space-y-6">
            <Card className="h-[10.5rem] w-full">
              <CardContent className="h-full p-6">
                <div className="flex h-full items-center gap-4">
                  <img
                    src="https://heroshotphotography.com/wp-content/uploads/2023/03/male-linkedin-corporate-headshot-on-white-square-1024x1024.jpg"
                    alt="Mert Müdür Profile"
                    className="h-full max-h-[8rem] w-auto rounded object-cover"
                  />
                  <div className="flex w-full h-full items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-base font-semibold leading-none m-0">
                        Mert Müdür
                      </h2>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>
                      <div className="mt-2 text-sm leading-tight space-y-1">
                        <p>
                          <strong>Age:</strong> 32
                        </p>
                        <p>
                          <strong>E-Mail:</strong> mert.müdür@gmail.com
                        </p>
                        <p>
                          <strong>Date of Birth:</strong> 15/05/1998
                        </p>
                        <p>
                          <strong>Current Status:</strong> Evaluating
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-10">
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        View Resume
                      </a>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Change Details
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-[18.5rem] w-full">
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
              </CardHeader>
              <CardContent
                className="overflow-y-auto h-full"
                id="transcript-card"
                style={{
                  maxHeight: "calc(100% - 4rem)",
                }}
              >
                {transcript.map((segment, index) => (
                  <div
                    key={index}
                    id={`transcript-item-${index}`}
                    className={`mb-4 ${
                      index <= currentIndex ? "font-bold" : "font-normal"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTranscriptClick(index)}
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

            <PersonalityBarChart newTraits={personalityChartData[currentIndex]} />
            <StressBarChart allStressData={allStressData} />
          </div>
        </div>

        <div className="mt-6 h-[4rem] w-full col-span-2 flex items-center gap-4">
          <span className="text-lg font-semibold">Skills:</span>
          <Card className="flex-1 h-[4rem] flex items-center">
            <CardContent className="flex items-center gap-4 flex-wrap w-full p-0 pl-4">
              {skills
                .filter((skill) => skill.skill_name.length >= 3)
                .sort((a, b) => b.confidence - a.confidence)
                .map((skill, index) => {
                  const color = skillBadgeColors[index % skillBadgeColors.length];
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="h-[2rem] flex items-center"
                      style={{
                        backgroundColor: color,
                        color: "#fff",
                        opacity: Math.max(0.5, skill.confidence),
                      }}
                    >
                      {skill.skill_name || "Unknown Skill"}
                    </Badge>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}


/*"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SidebarLayout from "@/components/sidebarlayout";
import { StressBarChart } from "@/components/stressChart"; // <-- Updated chart
import { StressPieChart } from "@/components/stressPieChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PersonalityBarChart } from "@/components/personalityChart";
import { PersonalityLineChart } from "@/components/personalityLineCharts";

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

// Temporary placeholder transcript
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

// Skill badge colors
const skillBadgeColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function CandidateDashboard() {
  // Video reference for time updates
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Current transcript index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Personality data: per question
  const [personalityChartData, setPersonalityChartData] = useState<PersonalityData[]>([]);

  // Stress data: entire array
  const [allStressData, setAllStressData] = useState<StressData[]>([]);

  // Skills array
  const [skills, setSkills] = useState<SkillData[]>([]);

  // Personality line chart data
  const personalityLineData = useMemo(() => {
    return personalityChartData.map((data, index) => ({
      time: transcript[index]?.startTime ?? index * 10,
      ...data,
    }));
  }, [personalityChartData]);

  // Fetch skills once
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Combine all answers
        const answersOnly = transcript.map((item) => item.answer).join(" ");
        const skillsResponse = await fetch("http://127.0.0.1:8000/api/skills-analysis/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: answersOnly }),
        });

        const skillsResult = await skillsResponse.json();
        setSkills(skillsResult.extracted_skills || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // Fetch Personality Data for All questions
  useEffect(() => {
    const fetchAllPersonalityData = async () => {
      try {
        const allAnswers = transcript.map((item) => item.answer);

        const personalityResponse = await fetch("http://127.0.0.1:8000/api/analyze-personality/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: allAnswers }),
        });

        const personalityResult = await personalityResponse.json();
        const newData: PersonalityData[] = personalityResult.personality_scores.map(
          (score: any, i: number) => ({
            question: `Q${i + 1}`,
            openness: score?.openness || 0,
            agreeableness: score?.agreeableness || 0,
            conscientiousness: score?.conscientiousness || 0,
            extraversion: score?.extraversion || 0,
            neuroticism: score?.neuroticism || 0,
          })
        );

        setPersonalityChartData(newData);
      } catch (error) {
        console.error("Error fetching all personality data:", error);
      }
    };

    fetchAllPersonalityData();
  }, []);

  // Fetch Stress Data for All questions
  useEffect(() => {
    const fetchAllStressData = async () => {
      try {
        const allAnswers = transcript.map((item) => item.answer);

        const stressResponse = await fetch("http://127.0.0.1:8000/api/analyze-stress/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: allAnswers }),
        });
        const stressResult = await stressResponse.json();

        const newStressData: StressData[] = stressResult.stress_analysis.map(
          (analysis: any, i: number) => ({
            question: `Q${i + 1}`,
            stress: analysis?.stress_level || "Unknown",
            confidence: (analysis?.confidence ?? 0) * 100, 
          })
        );

        setAllStressData(newStressData);
      } catch (error) {
        console.error("Error fetching all stress data:", error);
      }
    };

    fetchAllStressData();
  }, []);

  // Update currentIndex based on video time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;

    // Find which transcript segment we are in
    const segmentIndex = transcript.findIndex(
      (segment) => currentTime >= segment.startTime && currentTime <= segment.endTime
    );

    if (segmentIndex !== -1 && segmentIndex !== currentIndex) {
      setCurrentIndex(segmentIndex);
    }
  };

  // Handle transcript item click to jump in video
  const handleTranscriptClick = (index: number) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.currentTime = transcript[index].startTime;
    }
    setCurrentIndex(index);
  };

  // Scroll to active transcript when currentIndex changes
  useEffect(() => {
    const currentElement = document.querySelector(`#transcript-item-${currentIndex}`);
    const transcriptCard = document.getElementById("transcript-card");
    if (currentElement && transcriptCard) {
      const { offsetTop } = currentElement as HTMLElement;
      transcriptCard.scrollTo({
        top: offsetTop - transcriptCard.offsetTop,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

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

            <PersonalityLineChart personalityData={personalityLineData} />
          </div>

          <div className="space-y-6">
            <Card className="h-[10.5rem] w-full">
              <CardContent className="h-full p-6">
                <div className="flex h-full items-center gap-4">
                  <img
                    src="https://heroshotphotography.com/wp-content/uploads/2023/03/male-linkedin-corporate-headshot-on-white-square-1024x1024.jpg"
                    alt="Mert Müdür Profile"
                    className="h-full max-h-[8rem] w-auto rounded object-cover"
                  />

                  <div className="flex w-full h-full items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-base font-semibold leading-none m-0">
                        Mert Müdür
                      </h2>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>

                      <div className="mt-2 text-sm leading-tight space-y-1">
                        <p>
                          <strong>Age:</strong> 32
                        </p>
                        <p>
                          <strong>E-Mail:</strong> mert.müdür@gmail.com
                        </p>
                        <p>
                          <strong>Date of Birth:</strong> 15/05/1998
                        </p>
                        <p>
                          <strong>Current Status:</strong> Evaluating
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-10">
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        View Resume
                      </a>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Change Details
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-[18.5rem] w-full">
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
              </CardHeader>
              <CardContent
                className="overflow-y-auto h-full"
                id="transcript-card"
                style={{
                  maxHeight: "calc(100% - 4rem)",
                }}
              >
                {transcript.map((segment, index) => (
                  <div
                    key={index}
                    id={`transcript-item-${index}`}
                    className={`mb-4 ${
                      index <= currentIndex ? "font-bold" : "font-normal"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTranscriptClick(index)}
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

            <PersonalityBarChart newTraits={personalityChartData[currentIndex]} />
            <StressBarChart allStressData={allStressData} />
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
                .filter((skill) => skill.skill_name.length >= 3)
                .sort((a, b) => b.confidence - a.confidence)
                .map((skill, index) => {
                  const color = skillBadgeColors[index % skillBadgeColors.length];
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="h-[2rem] flex items-center"
                      style={{
                        backgroundColor: color,
                        color: "#fff",
                        opacity: Math.max(0.5, skill.confidence),
                      }}
                    >
                      {skill.skill_name || "Unknown Skill"}
                    </Badge>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

type QuestionData = {
  question: string;
  stress: string;     // e.g., "Not Stressed" or "Stressed"
  confidence: number; // e.g., a number in [0..100]
};

interface StressBarChartProps {
  allStressData: QuestionData[]; // entire array
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-blue))",
  },
};

export function StressBarChart({ allStressData }: StressBarChartProps) {
  // Transform each question’s data for chart display:
  // - If "Not Stressed": set bar around ~100 - confidence => closer to "Calm"
  // - If "Stressed":     set bar around ~100 + confidence => closer to "Stressed"
  // Adjust as you see fit. 
  const processedData = allStressData.map((item, idx) => {
    const adjustedConfidence =
      item.stress === "Not Stressed"
        ? Math.max(100 - item.confidence, 5)
        : Math.max(100 + item.confidence, 5);

    return {
      question: item.question || `Q${idx + 1}`,
      stress: item.stress,
      confidence: adjustedConfidence,
    };
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
            <BarChart width={400} height={250} data={processedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
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
                        : "hsl(var(--chart-gray))"
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
"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

type QuestionData = {
  question: string;
  stress: string;     // e.g., "Not Stressed" or "Stressed"
  confidence: number; // e.g., a number in [0..100]
};

interface StressBarChartProps {
  allStressData: QuestionData[]; // entire array
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-blue))",
  },
};

export function StressBarChart({ allStressData }: StressBarChartProps) {
  // Transform each question’s data for chart display:
  // - If "Not Stressed": set bar around ~100 - confidence => closer to "Calm"
  // - If "Stressed":     set bar around ~100 + confidence => closer to "Stressed"
  // Adjust as you see fit. 
  const processedData = allStressData.map((item, idx) => {
    const adjustedConfidence =
      item.stress === "Not Stressed"
        ? Math.max(100 - item.confidence, 5)
        : Math.max(100 + item.confidence, 5);

    return {
      question: item.question || `Q${idx + 1}`,
      stress: item.stress,
      confidence: adjustedConfidence,
    };
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
            <BarChart width={400} height={250} data={processedData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
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
                        : "hsl(var(--chart-gray))"
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
*/

}