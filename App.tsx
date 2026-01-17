
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Home, Compass, PlusSquare, Wallet as WalletIcon, User as UserIcon } from 'lucide-react';
import { Video, User } from './types';
import { INITIAL_VIDEOS, WATCH_REWARD } from './constants';
import { supabase } from './services/supabase';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Wallet from './components/Wallet';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronização de Sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          avatar: session.user.user_metadata?.avatar_url || `https://picsum.photos/seed/${session.user.id}/400/400`,
          walletBalance: 0
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null);
        setIsProfileOpen(false);
        setSession(null);
      } else if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          avatar: session.user.user_metadata?.avatar_url || `https://picsum.photos/seed/${session.user.id}/400/400`,
          walletBalance: 0
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca de Vídeos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erro Supabase Fetch:", error.message);
          setVideos(INITIAL_VIDEOS); 
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
        } else {
          setVideos(INITIAL_VIDEOS);
        }
      } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
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
    setCurrentUser(prev => prev ? ({ ...prev, walletBalance: prev.walletBalance + WATCH_REWARD }) : null);
  }, [currentUser]);

  const handleUpdateAvatar = async (newUrl: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, avatar: newUrl } : null);
    await supabase.auth.updateUser({
      data: { avatar_url: newUrl }
    });
  };

  // LOGOUT CORRIGIDO: Limpeza imediata da UI
  const handleLogout = async () => {
    // 1. Limpar UI imediatamente para feedback instantâneo
    setCurrentUser(null);
    setSession(null);
    setIsProfileOpen(false);
    setIsWalletOpen(false);
    
    // 2. Tentar deslogar no servidor de forma assíncrona
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sessão já estava encerrada ou erro de rede no logout.");
    }
  };

  const handleNewVideo = async (newVideo: Video) => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }
    
    try {
      const { data, error } = await supabase.from('videos').insert([{
        youtube_id: newVideo.youtubeId,
        creator_id: currentUser?.id,
        creator_name: currentUser?.name,
        creator_avatar: currentUser?.avatar,
        title: newVideo.title,
        description: newVideo.description,
        views: 0,
        likes: 0,
        tags: newVideo.tags
      }]).select();

      if (error) throw error;

      if (data && data[0]) {
        const savedVideo: Video = { ...newVideo, id: data[0].id };
        setVideos(prev => [savedVideo, ...prev]);
        containerRef.current?.scrollTo({top: 0, behavior: 'smooth'});
      }
    } catch (err: any) {
      alert("Erro ao publicar: " + err.message);
    }
  };

  const userUploadedVideos = videos.filter(v => v.creatorId === currentUser?.id);

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
            <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
               <p className="text-white/30 font-black italic uppercase tracking-widest text-xs">Sincronizando KwaiTube...</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none mt-safe">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 flex gap-8 shadow-2xl">
           <span className="text-white font-black text-sm border-b-[3px] border-brand-red pb-1 tracking-tight italic">Para Você</span>
           <span className="text-white/40 font-bold text-sm tracking-tight">Seguindo</span>
        </div>
        <button 
          onClick={() => currentUser ? setIsWalletOpen(true) : setIsAuthOpen(true)}
          className="pointer-events-auto bg-gradient-to-br from-brand-red to-brand-orange text-white px-5 py-3 rounded-full font-black text-xs flex items-center gap-2.5 shadow-[0_8px_20px_rgba(92, 10, 10, 0.4)] border border-white/20 active:scale-95 transition-all hover:brightness-110"
        >
          <WalletIcon size={14} strokeWidth={3} />
          R$ {currentUser?.walletBalance.toFixed(2) || "0.00"}
        </button>
      </div>

      <nav className="absolute bottom-0 w-full max-w-[500px] h-24 bg-gradient-to-t from-black via-black/95 to-transparent flex items-center justify-around px-8 z-50 pb-6">
        <button className="text-white flex flex-col items-center group transition-all" onClick={() => {
          containerRef.current?.scrollTo({top: 0, behavior: 'smooth'});
        }}>
          <Home size={26} className={`group-active:scale-125 transition ${activeIndex === 0 && !isProfileOpen ? 'text-brand-red' : 'text-white'}`} strokeWidth={3} />
          <span className={`text-[9px] font-black mt-1.5 uppercase tracking-tighter ${activeIndex === 0 && !isProfileOpen ? 'text-brand-red' : 'text-white'}`}>Início</span>
        </button>
        <button className="text-white/40 flex flex-col items-center group">
          <Compass size={26} className="group-active:scale-110 transition" />
          <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Explorar</span>
        </button>
        
        <button 
          onClick={() => session ? setIsUploadOpen(true) : setIsAuthOpen(true)}
          className="relative -mt-12 flex items-center justify-center animate-float group"
        >
          <div className="absolute inset-0 bg-brand-red/40 rounded-[1.8rem] blur-2xl animate-glow-pulse scale-110 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative shimmer w-16 h-16 bg-gradient-to-tr from-brand-red via-brand-orange to-brand-red bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] rounded-[1.8rem] flex items-center justify-center border-4 border-black shadow-[0_15px_35px_rgba(92, 10, 10, 0.4)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out active:scale-90 overflow-hidden">
            <PlusSquare size={32} className="text-white relative z-10" strokeWidth={3} />
          </div>
          <div className="absolute -top-1 -right-1 bg-white text-brand-red px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter shadow-md border border-brand-red/20 scale-90 group-hover:scale-110 transition-transform">
            FREE
          </div>
        </button>

        <button className="text-white/40 flex flex-col items-center group" onClick={() => currentUser ? setIsWalletOpen(true) : setIsAuthOpen(true)}>
          <WalletIcon size={26} className="group-active:scale-110 transition" />
          <span className="text-[9px] font-black mt-1.5 uppercase tracking-tighter">Ganhos</span>
        </button>
        <button 
          className="flex flex-col items-center group" 
          onClick={() => session ? setIsProfileOpen(true) : setIsAuthOpen(true)}
        >
          {session ? (
            <img src={currentUser?.avatar} className={`w-7 h-7 rounded-full border-2 object-cover shadow-[0_0_10px_rgba(92, 10, 10, 0.3)] ${isProfileOpen ? 'border-brand-red' : 'border-white/40'}`} alt="Profile" />
          ) : (
            <UserIcon size={26} className="group-active:scale-110 transition text-white/40" />
          )}
          <span className={`text-[9px] font-black mt-1.5 uppercase tracking-tighter ${isProfileOpen ? 'text-brand-red' : 'text-white/40'}`}>Perfil</span>
        </button>
      </nav>

      {isWalletOpen && currentUser && <Wallet balance={currentUser.walletBalance} onClose={() => setIsWalletOpen(false)} />}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUpload={handleNewVideo} currentUser={currentUser} />}
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      {isProfileOpen && currentUser && (
        <Profile 
          user={currentUser} 
          userVideos={userUploadedVideos} 
          onClose={() => setIsProfileOpen(false)} 
          onUpdateAvatar={handleUpdateAvatar}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
