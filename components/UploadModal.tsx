import React, { useState } from 'react';
import { Youtube, Sparkles, Loader2, X, PlusCircle } from 'lucide-react';
import { getEnhancedVideoMetadata } from '../services/geminiService.ts';
import { Video, User } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (video: Video) => void;
  currentUser: User | null;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, currentUser }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handlePaste = async () => {
    setError('');
    const videoId = extractYouTubeId(url);
    
    if (!videoId) {
      setError('Link inválido. Cole uma URL do YouTube ou Shorts.');
      return;
    }

    if (!currentUser) {
      setError('Usuário não carregado.');
      return;
    }

    setIsLoading(true);
    console.log("Iniciando processamento do vídeo ID:", videoId);

    try {
      // 1. Tentar obter metadados com IA (com timeout implícito pelo fetch interno)
      let metadata = null;
      try {
        metadata = await getEnhancedVideoMetadata(url);
        console.log("Metadados IA obtidos:", metadata);
      } catch (aiErr) {
        console.warn("Falha no Gemini AI, usando padrões:", aiErr);
      }
      
      // 2. Criar objeto de vídeo
      const newVideo: Video = {
        id: `temp-${Date.now()}`,
        youtubeId: videoId,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorAvatar: currentUser.avatar,
        title: metadata?.title || 'Vídeo Incrível!',
        description: metadata?.description || 'Assista este conteúdo no KwaiTube e ganhe recompensas.',
        views: 0,
        likes: 0,
        tags: metadata?.tags || ['viral', 'kwaitube']
      };

      console.log("Enviando vídeo para salvamento...");
      await onUpload(newVideo);
      onClose();
    } catch (err: any) {
      console.error("Erro fatal no upload:", err);
      setError('Erro ao processar vídeo. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-neutral-900 w-full max-w-md rounded-[3rem] p-8 border border-white/10 shadow-[0_0_50px_rgba(255,8,0,0.2)] animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic">PUBLICAR <span className="text-brand-red">SHORTS</span></h2>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Conectado ao Supabase</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition shadow-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-red rounded-3xl blur-xl opacity-20 group-focus-within:opacity-40 transition-all duration-500"></div>
            <div className="relative bg-black border-2 border-white/10 rounded-3xl flex items-center p-2 group-focus-within:border-brand-red/50 transition-all">
              <div className="p-4 bg-brand-red rounded-2xl mr-3 shadow-lg shadow-brand-red/20">
                <Youtube className="text-white" size={24} fill="white" />
              </div>
              <input
                type="text"
                placeholder="Cole o link do YouTube Shorts aqui..."
                className="w-full bg-transparent py-4 pr-4 text-sm text-white focus:outline-none placeholder:text-neutral-700 font-bold"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-brand-red text-xs font-black uppercase text-center tracking-widest bg-brand-red/10 py-3 rounded-xl border border-brand-red/20">{error}</p>}

          <div className="bg-gradient-to-br from-brand-red/10 to-transparent border border-white/5 p-6 rounded-[2rem] flex items-start gap-5">
            <div className="bg-brand-red/20 p-2.5 rounded-xl shadow-inner">
              <Sparkles className="text-brand-red" size={24} />
            </div>
            <div>
              <p className="text-xs text-neutral-300 font-bold leading-relaxed">
                Nossa IA vai gerar <span className="text-white font-black italic">títulos virais</span> e tags automáticas para seu vídeo!
              </p>
            </div>
          </div>

          <button
            onClick={handlePaste}
            disabled={isLoading || !url}
            className="w-full bg-gradient-to-r from-brand-red to-brand-orange disabled:from-neutral-800 disabled:to-neutral-800 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,8,0,0.4)] active:scale-[0.98] transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                <PlusCircle size={22} strokeWidth={3} />
                <span className="uppercase tracking-widest text-sm">ENVIAR AGORA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;