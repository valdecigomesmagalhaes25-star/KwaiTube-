
import React, { useState } from 'react';
import { Youtube, Search, Sparkles, Loader2 } from 'lucide-react';
import { getEnhancedVideoMetadata } from '../services/geminiService';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (newVideo: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePaste = async () => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Por favor, insira um link válido do YouTube.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Extract ID
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('shorts/')) {
        videoId = url.split('shorts/')[1].split('?')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }

      if (!videoId) throw new Error('Could not parse video ID');

      const metadata = await getEnhancedVideoMetadata(url);
      
      const newVideo = {
        id: Math.random().toString(36).substr(2, 9),
        youtubeId: videoId,
        creatorId: 'me',
        creatorName: 'Você',
        creatorAvatar: 'https://picsum.photos/seed/me/100/100',
        title: metadata?.title || 'Novo Vídeo Compartilhado',
        description: metadata?.description || 'Assista e ganhe recompensas!',
        views: 0,
        likes: 0,
        tags: metadata?.tags || ['compartilhado', 'youtube']
      };

      onUpload(newVideo);
      onClose();
    } catch (err) {
      setError('Falha ao processar o vídeo. Verifique o link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-neutral-900 w-full max-w-md rounded-3xl p-8 border border-neutral-800 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Publicar Vídeo</h2>
            <p className="text-neutral-400 text-sm">Cole o link do YouTube Shorts para ganhar por visualizações.</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">✕</button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
            <input
              type="text"
              placeholder="https://youtube.com/shorts/..."
              className="w-full bg-black border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
            <Sparkles className="text-orange-500 shrink-0" size={20} />
            <p className="text-xs text-orange-200">
              Nossa IA Gemini vai otimizar seu título e tags automaticamente para gerar mais ganhos!
            </p>
          </div>

          <button
            onClick={handlePaste}
            disabled={isLoading || !url}
            className="w-full bg-orange-600 disabled:bg-neutral-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-500 transition active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'CONCLUIR PUBLICAÇÃO'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
