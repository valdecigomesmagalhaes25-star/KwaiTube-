
import React from 'react';
import { Wallet as WalletIcon, TrendingUp, UserPlus, CreditCard } from 'lucide-react';

interface WalletProps {
  balance: number;
  onClose: () => void;
}

const Wallet: React.FC<WalletProps> = ({ balance, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto p-6 animate-in slide-in-from-right duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-orange-500 italic">CARTEIRA</h1>
        <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl">✕</button>
      </header>

      <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <p className="text-white/80 text-sm font-medium mb-1">Saldo Disponível</p>
        <h2 className="text-4xl font-black text-white flex items-baseline gap-1">
          <span className="text-xl">R$</span> {balance.toFixed(2)}
        </h2>
        <button className="mt-6 bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-50 transition active:scale-95">
          Sacar via PIX
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-neutral-900 p-4 rounded-2xl flex flex-col items-center text-center">
          <TrendingUp className="text-green-500 mb-2" />
          <span className="text-xs text-neutral-400">Ganhos Hoje</span>
          <span className="text-lg font-bold text-white">R$ 12,50</span>
        </div>
        <div className="bg-neutral-900 p-4 rounded-2xl flex flex-col items-center text-center">
          <UserPlus className="text-blue-500 mb-2" />
          <span className="text-xs text-neutral-400">Indicações</span>
          <span className="text-lg font-bold text-white">5</span>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Histórico de Recompensas</h3>
      <div className="space-y-3">
        {[
          { label: 'Vídeo assistido', amount: '+ R$ 0,50', time: '2 min atrás', color: 'text-green-500' },
          { label: 'Bônus de Criador', amount: '+ R$ 0,25', time: '10 min atrás', color: 'text-orange-500' },
          { label: 'Vídeo assistido', amount: '+ R$ 0,50', time: '15 min atrás', color: 'text-green-500' },
          { label: 'Bônus de Criador', amount: '+ R$ 0,25', time: '1h atrás', color: 'text-orange-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-neutral-900/50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="text-xs text-neutral-500">{item.time}</p>
            </div>
            <span className={`font-black ${item.color}`}>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
