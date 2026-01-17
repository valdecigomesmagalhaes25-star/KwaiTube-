
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Camera, 
  Grid, 
  Lock, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Mail, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { User, Video } from '../types';

interface ProfileProps {
  user: User;
  userVideos: Video[];
  onClose: () => void;
  onUpdateAvatar: (newUrl: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, userVideos, onClose, onUpdateAvatar, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'private'>('videos');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState(user.avatar);

  const handleLogoutClick = async () => {
    if (window.confirm("Deseja realmente sair da sua conta KwaiTube?")) {
      setIsLoggingOut(true);
      // Chamamos a função do pai para encerrar a sessão
      onLogout();
      // Não precisamos chamar onClose() aqui porque o App.tsx desmontará este componente ao limpar currentUser
    }
  };

  const handleAvatarSubmit = () => {
    onUpdateAvatar(newAvatarUrl);
    setIsEditingAvatar(false);
  };

  const randomizeAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setNewAvatarUrl(`https://picsum.photos/seed/${randomId}/400/400`);
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] overflow-y-auto animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h2 className="text-sm font-black uppercase tracking-widest text-white/50 italic">Perfil do Criador</h2>
        <button className="p-2 hover:bg-white/5 rounded-full transition">
          <Settings size={22} className="text-white" />
        </button>
      </header>

      {/* Hero Section / Avatar */}
      <div className="flex flex-col items-center pt-8 pb-6 px-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-red to-brand-orange rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-black shadow-2xl transition-transform group-hover:scale-[1.02]"
            />
            <button 
              onClick={() => setIsEditingAvatar(true)}
              className="absolute -bottom-2 -right-2 bg-brand-red p-3 rounded-2xl text-white shadow-xl border-4 border-black hover:scale-110 active:scale-90 transition-all"
            >
              <Camera size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-black text-white mt-6 tracking-tight italic">@{user.name}</h1>
        <div className="flex items-center gap-2 mt-1">
           <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Membro Prime</span>
           <div className="w-1 h-1 rounded-full bg-brand-orange"></div>
           <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">ID: {user.id.slice(0, 5)}</span>
        </div>

        {/* Stats Row */}
        <div className="flex gap-10 mt-8">
          <div className="text-center group cursor-pointer">
            <p className="text-xl font-black text-white italic group-hover:text-brand-orange transition-colors">2.4k</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Seguindo</p>
          </div>
          <div className="text-center group cursor-pointer">
            <p className="text-xl font-black text-white italic group-hover:text-brand-orange transition-colors">12.8k</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Seguidores</p>
          </div>
          <div className="text-center group cursor-pointer">
            <p className="text-xl font-black text-white italic group-hover:text-brand-orange transition-colors">45.2k</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Curtidas</p>
          </div>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="px-6 mb-8">
        <div className="bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-6 space-y-5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-1">
             <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]">Status da Conta</h3>
             <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black rounded uppercase">Ativa</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-red/10 rounded-2xl border border-brand-red/5">
              <ShieldCheck size={20} className="text-brand-red" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Segurança</p>
              <p className="text-sm font-black text-white flex items-center gap-1.5 italic">Verificado <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div></p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-red/10 rounded-2xl border border-brand-red/5">
              <Mail size={20} className="text-brand-red" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">E-mail de Acesso</p>
              <p className="text-sm font-black text-white/70 truncate">Registrado via KwaiTube</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="sticky top-[60px] z-10 bg-black/90 backdrop-blur-md border-b border-white/5 flex">
        <button 
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'videos' ? 'border-brand-red text-white' : 'border-transparent text-neutral-600'}`}
        >
          <Grid size={20} strokeWidth={activeTab === 'videos' ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">Vídeos</span>
        </button>
        <button 
          onClick={() => setActiveTab('liked')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'liked' ? 'border-brand-red text-white' : 'border-transparent text-neutral-600'}`}
        >
          <Heart size={20} strokeWidth={activeTab === 'liked' ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">Amei</span>
        </button>
        <button 
          onClick={() => setActiveTab('private')}
          className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'private' ? 'border-brand-red text-white' : 'border-transparent text-neutral-600'}`}
        >
          <Lock size={20} strokeWidth={activeTab === 'private' ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">Privado</span>
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-0.5 pb-24">
        {activeTab === 'videos' && userVideos.length > 0 ? (
          userVideos.map(video => (
            <div key={video.id} className="aspect-[9/16] bg-neutral-900 relative group overflow-hidden">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                alt={video.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Grid size={10} className="text-white opacity-70" />
                <span className="text-[10px] font-black text-white opacity-70">{video.views}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-24 flex flex-col items-center text-neutral-800">
            {activeTab === 'videos' ? (
              <>
                <div className="p-5 bg-neutral-900/50 rounded-full mb-4">
                  <Grid size={40} strokeWidth={1.5} className="opacity-20" />
                </div>
                <p className="font-black italic uppercase tracking-[0.2em] text-[10px] opacity-40">Galeria Vazia</p>
              </>
            ) : (
              <>
                <div className="p-5 bg-neutral-900/50 rounded-full mb-4">
                  <Lock size={40} strokeWidth={1.5} className="opacity-20" />
                </div>
                <p className="font-black italic uppercase tracking-[0.2em] text-[10px] opacity-40">Área Exclusiva</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Logout Footer */}
      <div className="px-6 pb-16 pt-8 bg-gradient-to-t from-brand-red/10 via-black to-black border-t border-white/5">
        <button 
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="group w-full py-5 bg-neutral-900/80 backdrop-blur-md border border-red-900/20 rounded-[2rem] flex items-center justify-center gap-3 text-red-500 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all duration-500 shadow-lg shadow-red-900/5 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <div className="p-1.5 bg-red-500/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <LogOut size={18} />
              </div>
              Encerrar Sessão KwaiTube
            </>
          )}
        </button>
        <p className="text-center text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-6 opacity-30">KwaiTube v1.0.4 • 2024</p>
      </div>

      {/* Modal Editar Avatar */}
      {isEditingAvatar && (
        <div className="fixed inset-0 bg-black/98 z-[70] flex items-center justify-center p-6 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
          <div className="bg-neutral-950 w-full max-w-sm rounded-[3rem] p-10 border border-white/10 shadow-[0_0_80px_rgba(92,10,10,0.4)]">
            <h3 className="text-xl font-black text-white italic mb-2 text-center uppercase tracking-tighter">Personalizar</h3>
            <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.3em] mb-8 text-center opacity-70">Identidade Visual</p>
            
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-red rounded-[2.5rem] blur-xl opacity-20 animate-pulse"></div>
                <img src={newAvatarUrl} className="w-44 h-44 rounded-[2.5rem] object-cover border-4 border-brand-red relative z-10 shadow-2xl" />
              </div>
              
              <div className="w-full space-y-4">
                <div className="bg-black border border-white/10 rounded-2xl p-4">
                   <p className="text-[8px] text-neutral-600 font-black uppercase tracking-widest mb-2">Link Direto da Imagem</p>
                   <input 
                    type="text" 
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-transparent text-xs text-white focus:outline-none font-bold"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={randomizeAvatar}
                    className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-[10px] uppercase tracking-widest transition border border-white/5"
                  >
                    <RefreshCw size={14} /> Novo
                  </button>
                  <button 
                    onClick={handleAvatarSubmit}
                    className="flex-1 bg-gradient-to-r from-brand-red to-brand-orange p-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-red/10 active:scale-95 transition"
                  >
                    Confirmar
                  </button>
                </div>
                
                <button 
                  onClick={() => setIsEditingAvatar(false)}
                  className="w-full text-neutral-500 font-black text-[9px] uppercase tracking-[0.4em] py-4 mt-2"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
