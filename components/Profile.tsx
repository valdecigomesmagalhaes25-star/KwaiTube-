
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Settings, Grid, Heart, LogOut, 
  Zap, Loader2, UserPlus, UserCheck, ShieldCheck
} from 'lucide-react';
import { User, Video } from '../types';
import { supabase } from '../services/supabase';
import { ADMIN_EMAIL } from '../constants';

interface ProfileProps {
  user: User;
  userVideos: Video[];
  isOwnProfile: boolean;
  onClose: () => void;
  onUpdateAvatar: (newUrl: string) => void;
  onLogout: () => void;
  onUpdateAdFrequency?: (seconds: number) => void;
  onOpenAdmin?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, userVideos, isOwnProfile, onClose, onUpdateAvatar, onLogout, onUpdateAdFrequency, onOpenAdmin 
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'settings'>('videos');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [freq, setFreq] = useState(user.adFrequency || 60);

  // Verificação de Master Admin baseada no e-mail real do usuário
  const isUserMaster = isOwnProfile && (user.email === ADMIN_EMAIL || (window as any).isMasterAdmin);

  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsFollowing(!isFollowing);
    setIsFollowLoading(false);
  };

  const handleLogoutClick = async () => {
    if (window.confirm("Deseja realmente sair?")) {
      setIsLoggingOut(true);
      onLogout();
    }
  };

  // Se o usuário for um placeholder temporário
  if (user.id === 'temp') {
    return (
      <div className="fixed inset-0 bg-black z-[160] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Sincronizando Perfil...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[160] overflow-y-auto animate-in slide-in-from-bottom duration-500">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-sm font-black uppercase tracking-widest text-white/50 italic">
          {isOwnProfile ? 'Meu Perfil' : 'Perfil do Criador'}
        </h2>
        {isOwnProfile ? (
          <button onClick={() => setActiveTab('settings')} className="p-2 hover:bg-white/5 rounded-full transition">
            <Settings size={22} className={activeTab === 'settings' ? 'text-brand-red' : 'text-white'} />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </header>

      {activeTab !== 'settings' ? (
        <>
          <div className="flex flex-col items-center pt-8 pb-6 px-6">
            <div className="relative">
              <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-brand-red shadow-2xl" />
              {isUserMaster && (
                <div className="absolute -top-2 -right-2 bg-amber-500 p-2 rounded-full border-2 border-black shadow-lg">
                  <ShieldCheck size={14} className="text-black" />
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-black text-white mt-6 tracking-tight italic">@{user.name}</h1>
            <p className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] mt-1">
              {isUserMaster ? 'Master Administrador 👑' : 'Nível Criador 💎'}
            </p>

            {/* BOTÃO ADMIN PARA O DONO DO APP */}
            {isUserMaster && (
              <button 
                onClick={onOpenAdmin}
                className="mt-6 w-full max-w-[250px] bg-amber-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                Painel Administrativo
              </button>
            )}

            {!isOwnProfile && (
              <button 
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`mt-6 w-full max-w-[200px] py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isFollowing 
                  ? 'bg-neutral-800 text-neutral-400 border border-white/10' 
                  : 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-lg shadow-brand-red/20 active:scale-95'
                }`}
              >
                {isFollowLoading ? <Loader2 size={16} className="animate-spin" /> : isFollowing ? <><UserCheck size={16} /> Seguindo</> : <><UserPlus size={16} /> Seguir</>}
              </button>
            )}

            <div className="flex gap-8 mt-8">
               <div className="text-center">
                  <p className="text-lg font-black text-white italic">12.5k</p>
                  <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Seguidores</p>
               </div>
               <div className="text-center">
                  <p className="text-lg font-black text-white italic">{userVideos.length}</p>
                  <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Vídeos</p>
               </div>
               <div className="text-center">
                  <p className="text-lg font-black text-white italic">84k</p>
                  <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Curtidas</p>
               </div>
            </div>
          </div>

          <div className="sticky top-[60px] z-10 bg-black/90 backdrop-blur-md border-b border-white/5 flex">
            <button onClick={() => setActiveTab('videos')} className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 ${activeTab === 'videos' ? 'border-brand-red text-white' : 'border-transparent text-neutral-600'}`}>
              <Grid size={20} />
              <span className="text-[8px] font-black uppercase">Postagens</span>
            </button>
            <button onClick={() => setActiveTab('liked')} className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 ${activeTab === 'liked' ? 'border-brand-red text-white' : 'border-transparent text-neutral-600'}`}>
              <Heart size={20} />
              <span className="text-[8px] font-black uppercase">Curtidos</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-0.5 pb-24">
            {activeTab === 'videos' && userVideos.length > 0 ? (
              userVideos.map(video => (
                <div key={video.id} className="aspect-[9/16] bg-neutral-900 overflow-hidden relative group">
                  <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                     <Grid size={10} className="text-white/50" />
                     <span className="text-[9px] text-white/50 font-black italic">1.2k</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-24 flex flex-col items-center opacity-30">
                <Grid size={40} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem Conteúdo</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4">
          <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-brand-red/20 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-brand-red/20 rounded-2xl">
                   <Zap size={24} className="text-brand-red" />
                </div>
                <div>
                   <h3 className="text-white font-black text-lg italic tracking-tight">Otimizar Ganhos</h3>
                   <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Ajustes AdMob</p>
                </div>
             </div>
             <input type="range" min="30" max="300" step="30" value={freq} onChange={(e) => { const v = parseInt(e.target.value); setFreq(v); onUpdateAdFrequency?.(v); }} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-red" />
             <div className="flex justify-between mt-3 px-1">
                <span className="text-[8px] font-black text-brand-red uppercase">Agressivo (30s)</span>
                <span className="text-[8px] font-black text-neutral-600 uppercase">Moderado (5m)</span>
             </div>
          </div>

          <button onClick={handleLogoutClick} className="w-full py-5 bg-neutral-900 border border-red-900/20 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-black uppercase text-xs">
            {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut size={18} />}
            Sair da Conta
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
