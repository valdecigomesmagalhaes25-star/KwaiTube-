
import React, { useState, useRef, useCallback } from 'react';
import { Home, Compass, PlusSquare, Wallet as WalletIcon, User as UserIcon } from 'lucide-react';
import { Video, User } from './types';
import { INITIAL_VIDEOS, WATCH_REWARD } from './constants';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Wallet from './components/Wallet';
import UploadModal from './components/UploadModal';

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'me',
    name: 'Seu Nome',
    avatar: 'https://picsum.photos/seed/me/100/100',
    walletBalance: 0.00
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  const handleReward = useCallback(() => {
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + WATCH_REWARD
    }));
  }, []);

  const handleNewVideo = (newVideo: Video) => {
    setVideos([newVideo, ...videos]);
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="video-container w-full max-w-[500px] h-full shadow-2xl relative"
      >
        {videos.map((video, idx) => (
          <div key={video.id} className="video-item relative w-full h-full">
            <VideoPlayer 
              video={video} 
              isActive={activeIndex === idx} 
              onRewardTriggered={handleReward}
            />
            <Sidebar 
              likes={video.likes} 
              views={video.views + (activeIndex === idx ? 1 : 0)} 
              avatar={video.creatorAvatar}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex gap-6">
           <span className="text-white font-black text-sm border-b-2 border-orange-500 pb-1">Para Você</span>
           <span className="text-white/60 font-bold text-sm">Seguindo</span>
        </div>
        <button 
          onClick={() => setIsWalletOpen(true)}
          className="pointer-events-auto bg-orange-600 text-white px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
        >
          <WalletIcon size={14} />
          R$ {currentUser.walletBalance.toFixed(2)}
        </button>
      </div>

      <nav className="absolute bottom-0 w-full max-w-[500px] h-16 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around px-4 z-50">
        <button className="text-white flex flex-col items-center">
          <Home size={24} />
          <span className="text-[10px] font-bold mt-1 uppercase">Início</span>
        </button>
        <button className="text-white/60 flex flex-col items-center">
          <Compass size={24} />
          <span className="text-[10px] font-bold mt-1 uppercase">Descobrir</span>
        </button>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-white text-black p-1 rounded-lg hover:scale-110 transition active:scale-95"
        >
          <PlusSquare size={32} />
        </button>
        <button className="text-white/60 flex flex-col items-center" onClick={() => setIsWalletOpen(true)}>
          <WalletIcon size={24} />
          <span className="text-[10px] font-bold mt-1 uppercase">Ganhos</span>
        </button>
        <button className="text-white/60 flex flex-col items-center">
          <UserIcon size={24} />
          <span className="text-[10px] font-bold mt-1 uppercase">Perfil</span>
        </button>
      </nav>

      {isWalletOpen && <Wallet balance={currentUser.walletBalance} onClose={() => setIsWalletOpen(false)} />}
      {isUploadOpen && <UploadModal onUpload={handleNewVideo} onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
};

export default App;
