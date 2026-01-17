
import React, { useEffect, useState, useRef } from 'react';
import { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
  onRewardTriggered: () => void;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onRewardTriggered, isActive }) => {
  const [rewarded, setRewarded] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const REWARD_TIME_MS = 8000;

  useEffect(() => {
    let interval: number;
    
    if (isActive && !rewarded) {
      const startTime = Date.now();
      
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / REWARD_TIME_MS) * 100, 100);
        
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          onRewardTriggered();
          setRewarded(true);
          clearInterval(interval);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (!rewarded) setProgress(0);
    };
  }, [isActive, rewarded, onRewardTriggered]);

  const getEmbedUrl = (id: string) => {
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`;
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {!rewarded && isActive && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10 z-30">
          <div 
            className="h-full bg-gradient-to-r from-brand-red to-brand-orange transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(255,8,0,0.8)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

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
           <span className="text-brand-red font-black text-3xl italic tracking-tighter opacity-20">KwaiTube</span>
        </div>
      )}
      
      <div className="absolute bottom-24 left-4 right-16 pointer-events-none">
        <h3 className="text-white font-black text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
          @{video.creatorName}
        </h3>
        <p className="text-white text-sm mt-1 line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight font-medium">{video.title}</p>
        <div className="flex gap-2 mt-3">
          {video.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-brand-red backdrop-blur-md px-2.5 py-1 rounded-md text-white font-bold uppercase tracking-wider border border-white/20 shadow-lg">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {rewarded && (
        <div className="absolute top-24 right-4 bg-gradient-to-br from-brand-red to-brand-orange text-white px-5 py-2 rounded-full text-[11px] font-black animate-bounce shadow-[0_4px_20px_rgba(255,8,0,0.5)] border border-white/30 z-40">
          💰 + R$ 0,50 RECEBIDO
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
