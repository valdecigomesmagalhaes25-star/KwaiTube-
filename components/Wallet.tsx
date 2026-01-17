
import React from 'react';
import { Wallet as WalletIcon, TrendingUp, UserPlus, CreditCard, ArrowLeft } from 'lucide-react';

interface WalletProps {
  balance: number;
  onClose: () => void;
}

const Wallet: React.FC<WalletProps> = ({ balance, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto p-6 animate-in slide-in-from-right duration-300">
      <header className="flex justify-between items-center mb-8">
        <button onClick={onClose} className="p-2 bg-neutral-900 rounded-full text-white active:scale-90 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black bg-gradient-to-r from-brand-red to-brand-orange bg-clip-text text-transparent italic tracking-tight">MINHA CARTEIRA</h1>
        <div className="w-10"></div>
      </header>

      <div className="bg-gradient-to-br from-brand-red via-brand-red to-brand-orange rounded-[2.5rem] p-8 mb-8 shadow-[0_20px_40px_rgba(255,8,0,0.3)] relative overflow-hidden border border-white/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        
        <p className="text-white/80 text-xs font-extrabold uppercase tracking-widest mb-2 drop-shadow-md">Saldo Total</p>
        <h2 className="text-6xl font-black text-white flex items-baseline gap-2 drop-shadow-2xl">
          <span className="text-2xl opacity-80">R$</span> {balance.toFixed(2)}
        </h2>
        
        <div className="mt-10 flex gap-4">
          <button className="flex-1 bg-white text-brand-red px-6 py-4 rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all hover:scale-[1.02]">
            SACAR VIA PIX
          </button>
          <button className="p-4 bg-black/30 backdrop-blur-md rounded-2xl text-white border border-white/20 active:scale-95 transition">
            <TrendingUp size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-neutral-900/80 border border-white/10 p-5 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg">
          <div className="bg-green-500/20 p-2.5 rounded-xl mb-3">
            <TrendingUp className="text-green-500" size={22} />
          </div>
          <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest">Ganhos Hoje</span>
          <span className="text-2xl font-black text-white mt-1">R$ 12,50</span>
        </div>
        <div className="bg-neutral-900/80 border border-white/10 p-5 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg">
          <div className="bg-brand-red/20 p-2.5 rounded-xl mb-3">
            <UserPlus className="text-brand-red" size={22} />
          </div>
          <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest">Indicações</span>
          <span className="text-2xl font-black text-white mt-1">5</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-xl font-black text-white italic">Atividades</h3>
        <span className="text-brand-red text-xs font-black uppercase tracking-widest">Ver Histórico</span>
      </div>
      
      <div className="space-y-4 pb-12">
        {[
          { label: 'Recompensa de Vídeo', amount: '+ R$ 0,50', time: 'Agora mesmo', color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Bônus de Criador', amount: '+ R$ 0,25', time: '12 min atrás', color: 'text-brand-red', bg: 'bg-brand-red/10' },
          { label: 'Recompensa de Vídeo', amount: '+ R$ 0,50', time: '18 min atrás', color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Indicação Amigo', amount: '+ R$ 2,00', time: '45 min atrás', color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-5 rounded-3xl flex justify-between items-center border border-white/5 shadow-sm active:scale-[0.98] transition`}>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse`}></div>
              <div>
                <p className="text-sm font-black text-white">{item.label}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5 tracking-tighter">{item.time}</p>
              </div>
            </div>
            <span className={`font-black text-lg ${item.color}`}>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
