import React, { useEffect, useState } from "react";
import YouTubeApp from "../Components/YoutubeApp.jsx";
import AddNotes from "../Components/forms/AddNotes";
import { useParams } from "react-router-dom";
import { getChaptersById } from "../Api/chapters.js";
import { extractVideoId } from "../Constants/index.js";

const VideoPlayerPage = () => {
  const { chapterId } = useParams(); // Get chapter ID from URL params
  const [videoId, setVideoId] = useState("");
  const [chapter, setChapter] = useState(null); // Initialize as null to check loading state

  // Function to fetch chapter data
  const fetchChapter = async () => {
    try {
      const chapterData = await getChaptersById(chapterId); // Fetch chapter data
      setChapter(chapterData);
      if (chapterData.video_link) {
        const videoId = extractVideoId(chapterData.video_link); // Extract video ID
        setVideoId(videoId);
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
    }
  };

  useEffect(() => {
    fetchChapter(); // Fetch chapter when component mounts or chapterId changes
  }, [chapterId]);

  // Return loading state while waiting for data
  if (!chapter) {
    return <div className="text-white">Loading...</div>;
  }

  // Helper function to truncate text on word boundaries
  const truncateText = (text, maxLength = 150) => {
    if (!text) return text;
    
    // Check if text ends abruptly (not with proper punctuation or complete words)
    const lastChar = text.trim().slice(-1);
    const endsAbruptly = text.length >= maxLength && !/[.!?;,]$/.test(lastChar) && !/\s$/.test(text);
    
    if (text.length <= maxLength && !endsAbruptly) return text;
    
    // If text is exactly at limit but ends abruptly, or exceeds limit, truncate properly
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...';
  };

  return (
    <div className="gap-2 p-4 w-full border-t-2 bg-gray-800 text-white">
       <h1 className="text-2xl font-bold mt-2 text-white">{chapter.title}</h1>
        <h1 className="text-md font-semibold my-4 text-gray-300">
          {truncateText(chapter.description)}
        </h1>
      <div className="flex flex-col lg:flex-row ">
      <div className="w-full md:w-3/4">
        {/* YouTubeApp receives the extracted videoId */}
        <YouTubeApp videoId={videoId} />
      </div>

      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <AddNotes journeyId={chapter.journey_id} chapterId={chapter.id} />
      </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
