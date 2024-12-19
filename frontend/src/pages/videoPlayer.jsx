import React, { useEffect, useState } from 'react';

const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const videoEndpoint = 'http://127.0.0.1:8000/video_play/P61.avi/';

    fetch(videoEndpoint)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      })
      .catch((error) => console.error('Error fetching video:', error));
  }, []);

  return (
    <div>
      {videoUrl ? (
        <video src={videoUrl} controls width="100%" height="auto">
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
