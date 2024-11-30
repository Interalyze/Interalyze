import React, { useState } from "react";
const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = Array.from(event.dataTransfer.files).find(file =>
      file.type.startsWith("video/")
    );
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

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
      <h1 className="text-center mb-4">Upload Your Video</h1>
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
    </div>
  );
};

export default FileUpload;
