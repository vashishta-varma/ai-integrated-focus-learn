import React from 'react';
import YouTube from 'react-youtube';
import logger from '../utils/logger'; // If you want to use react-youtube

const YouTubeApp = ({ videoId }) => {
  // Debug logging
  logger.ui(`📺 Loading video: ${videoId} (${typeof videoId}, length: ${videoId?.length})`);

  // Determine embed method based on preference: iframe vs. react-youtube
  const useIframe = true; // Set this to true for iframe, false for react-youtube

  const opts = {
    height: '515',
    width: '903',
    playerVars: {
      autoplay: 1, // Enable autoplay if desired
    },
  };

  return (
    <div className='block'>
      {videoId ? (
        useIframe ? (
          <iframe
            title="YouTube Video"
            width="903"
            height="515"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <YouTube videoId={videoId} opts={opts} />
          // Use react-youtube if preferred
        )
      ) : (
        <p>No video selected</p>
      )}
    </div>
  );
};

export default YouTubeApp;