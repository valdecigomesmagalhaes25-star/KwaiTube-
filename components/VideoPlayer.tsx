
import React, { useEffect, useState, useRef } from 'react';
import { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
  onRewardTriggered: () => void;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onRewardTriggered, isActive }) => {
  const [rewarded, setRewarded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isActive && !rewarded) {
      // Simulate watching progress
      const timer = setTimeout(() => {
        onRewardTriggered();
        setRewarded(true);
      }, 8000); // 8 seconds to earn reward
      return () => clearTimeout(timer);
    }
  }, [isActive, rewarded, onRewardTriggered]);

  // Handle URL parsing for both Shorts and normal videos
  const getEmbedUrl = (id: string) => {
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`;
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {isActive ? (
        <iframe
          ref={iframeRef}
          className="w-full h-full aspect-[9/16]"
          src={getEmbedUrl(video.youtubeId)}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-full bg-neutral-900 animate-pulse flex items-center justify-center">
           <span className="text-neutral-700 font-bold text-xl italic">KwaiTube</span>
        </div>
      )}
      
      {/* Overlay Info */}
      <div className="absolute bottom-20 left-4 right-12 pointer-events-none">
        <h3 className="text-white font-bold text-lg drop-shadow-lg">@{video.creatorName}</h3>
        <p className="text-white text-sm mt-1 line-clamp-2 drop-shadow-md">{video.title}</p>
        <div className="flex gap-2 mt-2">
          {video.tags.map(tag => (
            <span key={tag} className="text-xs bg-black/40 backdrop-blur-md px-2 py-1 rounded text-orange-400 font-semibold uppercase">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rewards Badge */}
      {rewarded && (
        <div className="absolute top-20 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-xl border border-orange-400">
          + R$ 0,50 RECEBIDO
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
