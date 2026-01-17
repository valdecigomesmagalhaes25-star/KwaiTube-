
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Home, Compass, PlusSquare, Wallet as WalletIcon, User as UserIcon, CircleDollarSign, Loader2 } from 'lucide-react';
import { Video, User } from './types';
import { INITIAL_VIDEOS, WATCH_REWARD, AD_WATCH_REWARD, CREATOR_AD_REWARD, ADMIN_EMAIL } from './constants';
import { supabase } from './services/supabase';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Wallet from './components/Wallet';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import AdOverlay, { AdType } from './components/AdOverlay';
import AdminDashboard from './components/AdminDashboard';
import NativeAd from './components/NativeAd';

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [adType, setAdType] = useState<AdType>('interstitial');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastAdTriggeredIndex = useRef(0);

  // Gatilho de App Open Ad
  useEffect(() => {
    const showAppOpen = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setAdType('app_open');
      setIsAdOpen(true);
    };
    showAppOpen();
  }, []);

  // Fetch e Garantia de Perfil
  const fetchProfile = async (userId: string, email?: string) => {
    setLoadingProfile(true);
    try {
      let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      if (error && error.code === 'PGRST116') {
        const { data: newData, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            name: email?.split('@')[0] || 'Usuário',
            viewer_earnings: 0,
            creator_earnings: 0,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
          }])
          .select()
          .single();
        
        if (!createError) data = newData;
      }

      if (data) {
        const userObj: User = {
          id: data.id,
          email: email || '', 
          name: data.name || 'Usuário',
          avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`,
          walletBalance: (data.viewer_earnings || 0) + (data.creator_earnings || 0),
          viewerEarnings: data.viewer_earnings || 0,
          creatorEarnings: data.creator_earnings || 0,
          totalViewsReceived: data.total_views_received || 0,
          totalAdsShownOnVideos: data.total_ads_shown || 0,
          adFrequency: data.ad_frequency || 60
        };
        setCurrentUser(userObj);
      }
    } catch (e) { 
      console.error("Erro ao carregar perfil:", e); 
    } finally { 
      setLoadingProfile(false); 
    }
  };

  // Sincronizar viewingProfileUser quando currentUser carregar
  useEffect(() => {
    if (isProfileOpen && currentUser && (!viewingProfileUser || viewingProfileUser.id === currentUser.id)) {
      setViewingProfileUser(currentUser);
    }
  }, [currentUser, isProfileOpen]);

  // Listener de Autenticação em Tempo Real
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id, session.user.email);
      else setLoadingProfile(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
        setIsAuthOpen(false); 
      } else {
        setCurrentUser(null);
        setIsProfileOpen(false);
        setViewingProfileUser(null);
        setLoadingProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca Vídeos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        const baseVideos = data && data.length > 0 ? data.map(v => ({
            id: v.id, youtubeId: v.youtube_id, creatorId: v.creator_id,
            creatorName: v.creator_name, creatorAvatar: v.creator_avatar,
            title: v.title, description: v.description,
            views: v.views || 0, likes: v.likes || 0, tags: v.tags || []
        })) : INITIAL_VIDEOS;

        const enrichedList: any[] = [];
        baseVideos.forEach((v, i) => {
          enrichedList.push(v);
          if ((i + 1) % 7 === 0) enrichedList.push({ isNativeAd: true, id: `ad-${i}` });
        });
        setVideos(enrichedList);
      } catch (err) { setVideos(INITIAL_VIDEOS); }
    };
    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
        if (index > 0 && index % 5 === 0 && index !== lastAdTriggeredIndex.current) {
          lastAdTriggeredIndex.current = index;
          setAdType('interstitial');
          setIsAdOpen(true);
        }
        if (index > 0 && index % 12 === 0 && index !== lastAdTriggeredIndex.current) {
          lastAdTriggeredIndex.current = index;
          setAdType('rewarded_interstitial');
          setIsAdOpen(true);
        }
      }
    }
  };

  const handleReward = useCallback(async () => {
    if (!currentUser) return;
    const reward = WATCH_REWARD;
    setCurrentUser(prev => prev ? ({...prev, viewerEarnings: prev.viewerEarnings + reward, walletBalance: prev.walletBalance + reward}) : null);
    await supabase.rpc('increment_viewer_earnings', { user_id: currentUser.id, amount: reward });
  }, [currentUser]);

  const handleAdComplete = async () => {
    if (!currentUser) return;
    const bonus = adType.includes('rewarded') ? AD_WATCH_REWARD * 2 : AD_WATCH_REWARD;
    setCurrentUser(prev => prev ? ({...prev, viewerEarnings: prev.viewerEarnings + bonus, walletBalance: prev.walletBalance + bonus}) : null);
    await supabase.rpc('increment_viewer_earnings', { user_id: currentUser.id, amount: bonus });
    const activeVideo = videos[activeIndex];
    if (activeVideo && !('isNativeAd' in activeVideo) && activeVideo.creatorId !== currentUser.id) {
       await supabase.rpc('increment_creator_earnings', { creator_id: activeVideo.creatorId, amount: CREATOR_AD_REWARD });
    }
    setIsAdOpen(false);
  };

  const handleProfileClick = async () => {
    let activeSession = session;
    
    // Fallback: se o estado estiver nulo, verifica no Supabase diretamente
    if (!activeSession) {
      const { data } = await supabase.auth.getSession();
      activeSession = data.session;
      if (activeSession) setSession(activeSession);
    }

    if (!activeSession) {
      setIsAuthOpen(true);
      return;
    }

    // Se houver sessão, abre o perfil. Se o currentUser ainda for nulo, o Profile tratará o loading interno.
    setIsProfileOpen(true);
    if (currentUser) {
      setViewingProfileUser(currentUser);
    } else {
      // Força o carregamento se ainda não tiver começado
      fetchProfile(activeSession.user.id, activeSession.user.email);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center">
      <div ref={containerRef} onScroll={handleScroll} className="video-container w-full max-w-[500px] h-full shadow-2xl relative">
        {videos.length > 0 ? (
          videos.map((item: any, idx) => (
            <div key={item.id} className="video-item relative w-full h-full">
              {item.isNativeAd ? (
                <NativeAd />
              ) : (
                <>
                  <VideoPlayer video={item} isActive={activeIndex === idx} onRewardTriggered={handleReward} />
                  <Sidebar likes={item.likes} views={item.views} avatar={item.creatorAvatar} onAvatarClick={() => {}} />
                </>
              )}
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900">
            <Loader2 className="animate-spin text-brand-red" size={40} />
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none mt-safe">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 shadow-xl">
           <span className="text-white font-black text-xs border-b-2 border-brand-red pb-1 italic uppercase tracking-widest">KwaiTube</span>
        </div>
        <button onClick={() => (session || currentUser) ? setIsWalletOpen(true) : setIsAuthOpen(true)} className="pointer-events-auto bg-gradient-to-br from-brand-red to-brand-orange text-white px-5 py-3 rounded-full font-black text-xs flex items-center gap-3 shadow-2xl active:scale-95 transition-all border border-white/20">
          <CircleDollarSign size={16} className="text-amber-400" />
          R$ {currentUser?.walletBalance.toFixed(4) || "0.0000"}
        </button>
      </div>

      <nav className="absolute bottom-0 w-full max-w-[500px] h-24 bg-gradient-to-t from-black flex items-center justify-around px-8 z-50">
        <button className="text-white flex flex-col items-center" onClick={() => { setIsProfileOpen(false); containerRef.current?.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <Home size={26} className={!isProfileOpen ? 'text-brand-red' : 'text-white'} strokeWidth={3} />
          <span className="text-[9px] font-black mt-1.5 uppercase">Feed</span>
        </button>
        <button onClick={() => (session || currentUser) ? setIsUploadOpen(true) : setIsAuthOpen(true)} className="relative -mt-12 w-16 h-16 bg-gradient-to-tr from-brand-red to-brand-orange rounded-[1.8rem] flex items-center justify-center border-4 border-black shadow-xl active:scale-90 transition">
          <PlusSquare size={32} className="text-white" strokeWidth={3} />
        </button>
        <button className="flex flex-col items-center" onClick={handleProfileClick}>
          {loadingProfile && !currentUser ? (
            <Loader2 size={26} className="animate-spin text-white/20" />
          ) : (session || currentUser) ? (
            <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=loading`} className="w-7 h-7 rounded-full border-2 border-white/40 shadow-glow-pulse" />
          ) : (
            <UserIcon size={26} className="text-white/40" />
          )}
          <span className="text-[9px] font-black mt-1.5 uppercase">Perfil</span>
        </button>
      </nav>

      {isAdOpen && <AdOverlay type={adType} onComplete={handleAdComplete} onClose={() => setIsAdOpen(false)} />}
      {isWalletOpen && currentUser && <Wallet user={currentUser} onClose={() => setIsWalletOpen(false)} />}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUpload={async () => {}} currentUser={currentUser} />}
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      
      {isProfileOpen && (
        <Profile 
          user={viewingProfileUser || currentUser || { id: 'temp', name: 'Carregando...', avatar: '', walletBalance: 0, viewerEarnings: 0, creatorEarnings: 0 }} 
          userVideos={videos.filter(v => !v.isNativeAd && v.creatorId === (viewingProfileUser?.id || currentUser?.id))} 
          isOwnProfile={currentUser?.id === (viewingProfileUser?.id || currentUser?.id)}
          onClose={() => setIsProfileOpen(false)} 
          onUpdateAvatar={() => {}}
          onLogout={async () => {
             await supabase.auth.signOut();
             setIsProfileOpen(false);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

export default App;
