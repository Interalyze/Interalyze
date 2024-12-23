import React, { ChangeEvent, useState } from "react";

const CreateCandidate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    managerName: "",
    jobPosition: "",
    dateOfBirth: "",
    interviewDate: "",
    image: null as File | null,
    resume: null as File | null,
    consentForm: null as File | null,
  });

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    if (e.target.files) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="container">
      {/* Form and JSX content */}
      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, "image")}
        />
      </div>
      <div className="form-group">
        <label>Resume</label>
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, "resume")}
        />
      </div>
      <div className="form-group">
        <label>Consent Form</label>
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, "consentForm")}
        />
      </div>
    </div>
  );
};

export default CreateCandidate;
