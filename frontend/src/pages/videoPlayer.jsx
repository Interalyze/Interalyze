import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ fileId }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/video_play/P61`)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      });
  }, [fileId]);

  return (
    <div>
      {videoUrl ? (
        <ReactPlayer url={videoUrl} controls={true} />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
