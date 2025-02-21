"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SidebarLayout from "@/components/sidebarlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaFile } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  managerName: string;
  jobPosition: string;
  dateOfBirth: string;
  interviewDate: string;
  image: File | null;
  resume: File | null;
  consentForm: File | null;
  video: File | null;
}

const CreateCandidate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    managerName: "",
    jobPosition: "",
    dateOfBirth: "",
    interviewDate: "",
    image: null,
    resume: null,
    consentForm: null,
    video: null,
  });

  // NEW: State for image preview URL
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [draggedFile, setDraggedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileUpload = (
    fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ): void => {
    let file: File | null = null;

    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else if (fileOrEvent.target.files && fileOrEvent.target.files[0]) {
      file = fileOrEvent.target.files[0];
    }

    if (!file) {
      console.error("Invalid file upload attempt.");
      return;
    }

    // Check file type if this is the 'image' field
    if (field === "image") {
      // We only want .jpg, so check the extension or MIME type
      if (!file.name.toLowerCase().endsWith(".jpg")) {
        alert("Please select a .jpg file only.");
        return;
      }
      // Generate preview URL for display in the avatar
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }

    setFormData((prevState) => ({
      ...prevState,
      [field]: file,
    }));
  };

  const handleDragAndDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type === "video/mp4") {
      setDraggedFile(file);
      handleFileUpload(file, "video");
    } else {
      alert("Please upload a valid MP4 file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormData];
      if (value) {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/video_play/upload_video/",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const result = await response.json();
      setSuccessMessage(`Candidate created successfully: ${result.message}`);

      // Clear all inputs
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        managerName: "",
        jobPosition: "",
        dateOfBirth: "",
        interviewDate: "",
        image: null,
        resume: null,
        consentForm: null,
        video: null,
      });
      setDraggedFile(null);
      setPreviewUrl(""); // Clear the avatar preview
    } catch (error) {
      console.error("Failed to create candidate:", error);
      setSuccessMessage("Failed to create candidate. Please try again.");
    } finally {
      setIsLoading(false);
    }

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <SidebarLayout>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="loader" />
          <p className="mt-4 text-white font-medium">
            Please be patient, the candidate is being created...
          </p>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow">
          {successMessage}
        </div>
      )}
      <div className="min-h-screen bg-gray-100">
        <div className="flex-1 bg-gray-100 p-6 flex justify-center">
          <div className="grid grid-cols-2 gap-x-20">
            {/* Left Card for Form Fields */}
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle>Enter Candidate Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div>
                    <Label
                      htmlFor="Name"
                      className="block text-sm font-medium mt-4 mb-1"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Name"
                      type="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="email"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          placeholder="Email address"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="managerName"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Give Access to Managers
                        </Label>
                        <Input
                          id="managerName"
                          name="managerName"
                          placeholder="Manager Name"
                          value={formData.managerName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="dateOfBirth"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Date of Birth
                        </Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          placeholder="DD/MM/YYYY"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="image"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Image
                        </Label>
                        <div className="flex items-center">
                          {/* ACCEPT ONLY .JPG */}
                          <Input
                            id="image"
                            type="file"
                            accept=".jpg"
                            onChange={(e) => handleFileUpload(e, "image")}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="resume"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Resume
                        </Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="resume"
                            type="file"
                            onChange={(e) => handleFileUpload(e, "resume")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="jobPosition"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Job Position
                        </Label>
                        <Input
                          id="jobPosition"
                          name="jobPosition"
                          placeholder="Job Position"
                          value={formData.jobPosition}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="interviewDate"
                          className="block text-sm font-medium mt-4 mb-1"
                        >
                          Interview Date
                        </Label>
                        <Input
                          id="interviewDate"
                          name="interviewDate"
                          placeholder="DD/MM/YYYY"
                          type="date"
                          value={formData.interviewDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-4">
                        {/* Avatar and Name */}
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-gray-700 font-medium">
                           
                          </p>
                          <div className="pt-4">
                          <div className="sidebar-profile">
                          <Avatar className="avatar">
                            <AvatarImage
                              src={previewUrl}
                              alt="Ahmet Ince"
                              className="avatar-image" // Apply custom styles here
                            />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        </div>
                        </div>

                        </div>

                        {/* Resume File Input and Link */}
                        <div className="pt-4">
                        <div className="flex flex-col items-center space-x-4 ">
                          <a href="#" className="text-blue-500 underline">
                            Resume.docx
                          </a>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Right Cards */}
            <div className="space-y-6">
              {/* Drag Candidate's MP4 File Card */}
              <Card className="mp4-upload-card">
                <CardHeader className="mb-2">
                  <CardTitle className="w-full">
                    Drag Candidate's MP4 File
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div
                    style={{ height: "12rem" }}
                    className="flex items-center justify-center h-40 border border-dashed border-gray-400 rounded-md cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDragAndDrop}
                    onClick={() =>
                      document.getElementById("videoInput")?.click()
                    }
                  >
                    {draggedFile ? (
                      <div className="flex items-center space-x-2">
                        <FaFile className="text-gray-500 text-lg" />
                        <p className="text-gray-500 text-sm">
                          {draggedFile.name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center">
                        Drag MP4 file here or click to upload
                      </p>
                    )}
                  </div>
                  <Input
                    id="videoInput"
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, "video");
                      } else {
                        alert("No file selected or invalid file.");
                      }
                    }}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* Consent Form Card */}
              <form onSubmit={handleSubmit}>
                <Card className="card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-700 text-base font-normal">
                      Below is a .docx file that concerns the rights of the
                      candidates using this system. It must be read and signed
                      by the candidate before any analysis can take place.
                      Upload the form in the area below.
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-8">
                      <a href="#" className="text-blue-500 underline">
                        ConsentForm.docx
                      </a>
                      <div className="w-full">
                        <Label
                          htmlFor="consentForm"
                          className="block text-gray-700 text-sm mb-1"
                        >
                          Consent Form
                        </Label>
                        <Input
                          id="consentForm"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, "consentForm");
                            } else {
                              console.error("No file selected or invalid file.");
                              alert("Please select a valid file.");
                            }
                          }}
                          className="w-full border border-gray-300 p-2 rounded"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create Candidate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default CreateCandidate;
