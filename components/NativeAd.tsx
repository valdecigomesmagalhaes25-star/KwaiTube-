
import React from 'react';
import { ExternalLink, Info, ShieldCheck } from 'lucide-react';

const NativeAd: React.FC = () => {
  return (
    <div className="video-item relative w-full h-full bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Visual do Ad */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-red/20 via-black to-black opacity-60"></div>
      
      <div className="relative z-10 w-full max-w-[85%] flex flex-col items-center text-center p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="absolute -top-6 bg-brand-orange text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
          <ShieldCheck size={14} /> Patrocinado
        </div>

        <div className="w-24 h-24 bg-gradient-to-br from-brand-red to-brand-orange rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-float">
          <ExternalLink size={40} className="text-white" />
        </div>

        <h2 className="text-2xl font-black text-white italic leading-tight mb-2">Conheça o Novo App Premium</h2>
        <p className="text-neutral-400 text-xs font-medium leading-relaxed mb-8">
          Baixe agora e ganhe 50% de desconto na primeira compra. Oferta exclusiva para usuários KwaiTube!
        </p>

        <button className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
          SAIBA MAIS
          <ExternalLink size={18} />
        </button>

        <div className="mt-6 flex items-center gap-2 text-neutral-600">
          <Info size={12} />
          <span className="text-[8px] font-black uppercase tracking-widest">Anúncio do Google AdMob</span>
        </div>
      </div>

      {/* Interface Falsa de Vídeo para Integração */}
      <div className="absolute bottom-24 left-4 pointer-events-none opacity-50">
        <h3 className="text-white font-black text-lg">@anunciante_oficial</h3>
        <p className="text-white text-sm mt-1">Clique no botão para aproveitar!</p>
      </div>
    </div>
  );
};

export default NativeAd;
