
import React from 'react';
import { 
  ArrowLeft, Tv, PlayCircle, Eye, Zap, PiggyBank, 
  Briefcase, TrendingUp, DollarSign, Info, Gift, ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface WalletProps {
  user: User;
  onClose: () => void;
}

const Wallet: React.FC<WalletProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-[150] overflow-y-auto animate-in slide-in-from-right duration-500">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl px-6 py-6 flex justify-between items-center border-b border-white/5">
        <button onClick={onClose} className="p-2.5 bg-neutral-900 rounded-full text-white active:scale-90 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black italic tracking-widest text-white uppercase">Saldos & Prêmios</h1>
        <div className="w-10"></div>
      </header>

      {/* BANNER AD SIMULADO (TOP PLACEMENT) */}
      <div className="w-full bg-neutral-900 border-b border-white/5 p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="bg-brand-red/20 p-2 rounded-lg"><ShieldCheck size={14} className="text-brand-red" /></div>
            <div>
               <p className="text-[8px] text-white font-black uppercase tracking-widest leading-none">Anúncio Patrocinado</p>
               <p className="text-[10px] text-neutral-500 font-bold">Investimentos Pro: Baixe e Ganhe</p>
            </div>
         </div>
         <button className="bg-white text-black text-[9px] font-black px-4 py-2 rounded-lg uppercase">Baixar</button>
      </div>

      <div className="p-6 pb-32">
        {/* SALDO TOTAL */}
        <div className="bg-gradient-to-br from-brand-red to-brand-orange rounded-[3rem] p-10 mb-8 shadow-[0_20px_50px_rgba(255,8,0,0.3)] relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Seu Patrimônio KwaiTube</p>
          <h2 className="text-6xl font-black text-white italic tracking-tighter">
            <span className="text-2xl not-italic mr-2 opacity-50 font-medium">R$</span>
            {user.walletBalance.toFixed(4)}
          </h2>
          <div className="mt-8 flex gap-3">
            <button className="flex-1 bg-white text-brand-red py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition">Solicitar Pix</button>
          </div>
        </div>

        {/* GANHOS EXTRAS (REWARDED VIDEO TRIGGER) */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-6 rounded-[2rem] mb-10 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="bg-amber-500/20 p-3 rounded-2xl shadow-inner animate-pulse"><Gift className="text-amber-500" /></div>
              <div>
                 <h4 className="text-white font-black text-sm italic">Ganhe R$ 0,10 Agora</h4>
                 <p className="text-[9px] text-neutral-500 font-bold uppercase">Assista a um vídeo bônus</p>
              </div>
           </div>
           <button className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-amber-500/20 active:scale-95 transition-all">ASSISTIR</button>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 gap-4 mb-10">
           <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center">
              <Tv className="text-green-500 mb-2" size={24} />
              <p className="text-[9px] text-neutral-500 font-black uppercase mb-1">Espectador</p>
              <p className="text-xl font-black text-white italic">R$ {user.viewerEarnings.toFixed(4)}</p>
           </div>
           <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center">
              <Briefcase className="text-brand-orange mb-2" size={24} />
              <p className="text-[9px] text-neutral-500 font-black uppercase mb-1">Criador</p>
              <p className="text-xl font-black text-white italic">R$ {user.creatorEarnings.toFixed(4)}</p>
           </div>
        </div>

        {/* INFORMAÇÕES ADMOB */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl flex items-start gap-4">
           <Info size={18} className="text-brand-red mt-1" />
           <p className="text-[10px] text-neutral-400 font-bold leading-relaxed italic">
             O KwaiTube utiliza a rede <span className="text-white">Google AdMob</span> para gerar recompensas. Ao assistir vídeos completos, você ajuda a manter a comunidade ativa e lucrativa para todos!
           </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
