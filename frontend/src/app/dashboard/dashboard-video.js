"use client";

import { useRef } from "react";

export default function DashboardVideo() {
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div>
      <h2>Interview Video</h2>
      <video
        ref={videoRef}
        width="640"
        height="360"
        controls
        className="border rounded"
      >
        <source src="/mock-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <br />
      <button
        onClick={handlePlayPause}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Play/Pause
      </button>
    </div>
  );
}
