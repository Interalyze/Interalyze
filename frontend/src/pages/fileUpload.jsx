import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import FormContainer from '../components/formContainer';
import ComboBox from '../components/comboBox';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = Array.from(event.dataTransfer.files).find(file =>
      file.type.startsWith("video/")
    );
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  const handleSave = async(value) => {
        console.log("Saving is disabled. Value not saved:", value);
        return;
  }


  const handleFileSelect = (event) => {
    const selectedFile = Array.from(event.target.files).find(file =>
      file.type.startsWith("video/")
    );
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="container my-5">
      <FormContainer title="Record Candidate">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" >
            <Form.Control
              className="textInput"
              type="Name"
              placeholder="Enter the Candidate's Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail" >
            <Form.Control
              className="textInput"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div
            className="upload-area border rounded p-4 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: "2px dashed #6c757d",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            {!file && (
              <>
                <p className="text-muted">Drag and drop your video file here</p>
                <p>OR</p>
                <input
                  type="file"
                  accept="video/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Select File
                </button>
              </>
            )}
            {file && (
              <div className="uploaded-file mt-3">
                <p className="text-success">File uploaded: {file.name}</p>
                <button className="btn btn-danger" onClick={removeFile}>
                  Remove File
                </button>
              </div>
            )}
          </div>

          <ComboBox
                apiEndpoint="/api/job-titles"
                placeholder="Enter or select a job title"
                onSave={handleSave}
            />

          <Button variant="primary" className="outputButton" type="submit">
            Create Candidate
          </Button>

          {errorMessage && <Alert variant="danger" className='textInput' style={{}} >{errorMessage}</Alert>}
        </Form>
      </FormContainer>

    </div>
  );
};

export default FileUpload;
