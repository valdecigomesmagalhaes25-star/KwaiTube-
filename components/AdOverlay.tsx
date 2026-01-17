
import React, { useEffect, useState } from 'react';
import { PlayCircle, X, CircleDollarSign, Loader2, Zap, Gift, Smartphone } from 'lucide-react';

export type AdType = 'interstitial' | 'rewarded' | 'rewarded_interstitial' | 'app_open';

interface AdOverlayProps {
  type: AdType;
  onComplete: () => void;
  onClose: () => void;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ type, onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(type === 'rewarded' ? 15 : 5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [type]);

  const getAdInfo = () => {
    switch (type) {
      case 'rewarded':
        return { title: 'VÍDEO PREMIADO', icon: Gift, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'rewarded_interstitial':
        return { title: 'BÔNUS RELÂMPAGO', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'app_open':
        return { title: 'BEM-VINDO AO KWAITUBE', icon: Smartphone, color: 'text-brand-red', bg: 'bg-brand-red/10' };
      default:
        return { title: 'ANÚNCIO INTERSTICIAL', icon: PlayCircle, color: 'text-brand-red', bg: 'bg-brand-red/10' };
    }
  };

  const info = getAdInfo();

  return (
    <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute top-12 flex flex-col items-center">
         <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-2 ${info.bg.replace('/10', '')}`}>
           <info.icon size={14} /> {info.title}
         </div>
         <p className="text-white/40 text-[9px] font-bold mt-3 uppercase tracking-[0.2em]">Google AdMob Intelligence</p>
      </div>

      <div className="w-full max-w-sm aspect-[9/16] max-h-[70vh] bg-neutral-900 rounded-[3rem] border-2 border-white/5 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
         <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-brand-red via-transparent to-brand-orange`}></div>
         
         <info.icon size={80} className={`${info.color} mb-6 relative z-10 animate-pulse`} strokeWidth={1} />
         <p className="text-white font-black italic text-2xl relative z-10 tracking-tighter">KwaiTube Ad Unit</p>
         
         {!canClose && (
           <div className="absolute bottom-8 bg-black/80 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 text-white font-black text-sm flex items-center gap-3">
             <Loader2 size={16} className="animate-spin text-brand-red" />
             Aguarde {timeLeft}s
           </div>
         )}
      </div>

      <div className="mt-10 w-full max-w-sm text-center">
        {canClose ? (
          <button 
            onClick={() => { onComplete(); onClose(); }}
            className="w-full bg-white text-black font-black py-6 rounded-3xl flex items-center justify-center gap-4 shadow-2xl animate-in zoom-in active:scale-95 transition-all"
          >
            <CircleDollarSign size={24} />
            <span className="uppercase tracking-widest text-sm">COLETAR RECOMPENSA</span>
          </button>
        ) : (
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Não feche o anúncio para receber seus créditos AdMob.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdOverlay;
