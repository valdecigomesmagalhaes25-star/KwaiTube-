import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Home, Compass, PlusSquare, Wallet as WalletIcon, User as UserIcon } from 'lucide-react';
import { Video, User } from './types';
import { INITIAL_VIDEOS, WATCH_REWARD } from './constants';
import { supabase } from './services/supabase';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Wallet from './components/Wallet';
import UploadModal from './components/UploadModal';

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'guest-user',
    name: 'Usuário Convidado',
    avatar: 'https://picsum.photos/seed/guest/100/100',
    walletBalance: 0.00
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carregar vídeos do Supabase ao iniciar
  useEffect(() => {
    const fetchVideos = async () => {
      console.log("Buscando vídeos no Supabase...");
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erro Supabase Fetch:", error.message);
          setVideos(INITIAL_VIDEOS); // Fallback para vídeos locais se der erro
          return;
        }

        if (data && data.length > 0) {
          const mappedVideos = data.map(v => ({
            id: v.id,
            youtubeId: v.youtube_id,
            creatorId: v.creator_id,
            creatorName: v.creator_name,
            creatorAvatar: v.creator_avatar,
            title: v.title,
            description: v.description,
            views: v.views || 0,
            likes: v.likes || 0,
            tags: v.tags || []
          }));
          setVideos(mappedVideos);
          console.log("Vídeos carregados:", mappedVideos.length);
        } else {
          setVideos(INITIAL_VIDEOS);
        }
      } catch (err) {
        console.error("Erro catastrófico ao carregar vídeos:", err);
        setVideos(INITIAL_VIDEOS);
      }
    };

    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  const handleReward = useCallback(async () => {
    if (!currentUser) return;
    const newBalance = currentUser.walletBalance + WATCH_REWARD;
    setCurrentUser(prev => prev ? ({ ...prev, walletBalance: newBalance }) : null);
  }, [currentUser]);

  const handleNewVideo = async (newVideo: Video) => {
    console.log(">>> Iniciando salvamento no Supabase...");
    console.log("Dados do vídeo:", newVideo);
    
    try {
      const { data, error } = await supabase.from('videos').insert([{
        youtube_id: newVideo.youtubeId,
        creator_id: newVideo.creatorId,
        creator_name: newVideo.creatorName,
        creator_avatar: newVideo.creatorAvatar,
        title: newVideo.title,
        description: newVideo.description,
        views: 0,
        likes: 0,
        tags: newVideo.tags
      }]).select();

      if (error) {
        console.error(">>> ERRO AO SALVAR NO SUPABASE:", error.message);
        alert("Erro no Banco de Dados: " + error.message);
        return;
      }

      if (data && data[0]) {
        console.log(">>> VÍDEO SALVO COM SUCESSO! ID:", data[0].id);
        const savedVideo: Video = {
          ...newVideo,
          id: data[0].id
        };
        setVideos(prev => [savedVideo, ...prev]);
        
        if(containerRef.current) {
          containerRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    } catch (error: any) {
      console.error(">>> ERROinesperado no salvamento:", error);
      alert("Erro inesperado. Verifique o console do navegador.");
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="video-container w-full max-w-[500px] h-full shadow-2xl relative"
      >
        {videos.length > 0 ? (
          videos.map((video, idx) => (
            <div key={`${video.id}-${idx}`} className="video-item relative w-full h-full">
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
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900">
            <p className="text-white/50 animate-pulse font-bold italic uppercase tracking-widest">Carregando KwaiTube...</p>
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none mt-safe">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 flex gap-8 shadow-2xl">
           <span className="text-white font-black text-sm border-b-[3px] border-brand-red pb-1 tracking-tight italic">Para Você</span>
           <span className="text-white/40 font-bold text-sm tracking-tight">Seguindo</span>
        </div>
        <button 
          onClick={() => setIsWalletOpen(true)}
          className="pointer-events-auto bg-gradient-to-br from-brand-red to-brand-orange text-white px-5 py-3 rounded-full font-black text-xs flex items-center gap-2.5 shadow-[0_8px_20px_rgba(255,8,0,0.4)] border border-white/20 active:scale-95 transition-all hover:brightness-110"
        >
          <WalletIcon size={14} strokeWidth={3} />
          R$ {currentUser?.walletBalance.toFixed(2) || "0.00"}
        </button>
      </div>

      <nav className="absolute bottom-0 w-full max-w-[500px] h-24 bg-gradient-to-t from-black via-black/95 to-transparent flex items-center justify-around px-8 z-50 pb-6">
        <button className="text-white flex flex-col items-center group transition-all" onClick={() => {
          if(containerRef.current) containerRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }}>
          <Home size={26} className={`group-active:scale-125 transition ${activeIndex === 0 ? 'text-brand-red' : 'text-white'}`} strokeWidth={3} />
          <span className={`text-[9px] font-black mt-1.5 uppercase tracking-tighter ${activeIndex === 0 ? 'text-brand-red' : 'text-white'}`}>Início</span>
        </button>
        <button className="text-white/40 flex flex-col items-center group">
          <Compass size={26} className="group-active:scale-110 transition" />
          <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Explorar</span>
        </button>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="relative -mt-10 flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-brand-red blur-2xl opacity-40 group-hover:opacity-60 transition"></div>
          <div className="relative bg-white text-black p-2 rounded-[1.25rem] hover:scale-110 transition-all active:scale-90 shadow-[0_10px_30px_rgba(255,255,255,0.2)] border-4 border-black">
            <PlusSquare size={36} strokeWidth={3} />
          </div>
        </button>
        <button className="text-white/40 flex flex-col items-center group" onClick={() => setIsWalletOpen(true)}>
          <WalletIcon size={26} className="group-active:scale-110 transition" />
          <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Ganhos</span>
        </button>
        <button className="text-white/40 flex flex-col items-center group">
          <UserIcon size={26} className="group-active:scale-110 transition" />
          <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Perfil</span>
        </button>
      </nav>

      {isWalletOpen && currentUser && <Wallet balance={currentUser.walletBalance} onClose={() => setIsWalletOpen(false)} />}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUpload={handleNewVideo} currentUser={currentUser} />}
    </div>
  );
};

export default App;