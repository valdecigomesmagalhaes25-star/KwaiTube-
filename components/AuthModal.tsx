
import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, ArrowLeft, Facebook, Chrome } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  onClose: () => void;
}

type AuthView = 'login' | 'register' | 'forgot';

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const getTitle = () => {
    if (view === 'login') return 'BEM-VINDO';
    if (view === 'register') return 'CRIAR CONTA';
    return 'RECUPERAR';
  };

  const getSubtitle = () => {
    if (view === 'login') return 'NO KWAITUBE';
    if (view === 'register') return 'NOVA JORNADA';
    return 'ACESSO AO APP';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (view === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        setMessage({ text: 'Conta criada! Verifique seu e-mail.', type: 'success' });
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ text: 'Link enviado para o e-mail.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Erro inesperado.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-neutral-900 w-full max-w-md rounded-[3rem] p-8 border border-white/10 shadow-[0_0_80px_rgba(255,8,0,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-orange opacity-50"></div>
        <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition">
          <X size={20} />
        </button>

        <div className="text-center mb-10 mt-4">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            {getTitle()}
            <span className="text-brand-red block not-italic font-extrabold text-sm tracking-[0.3em] mt-1 opacity-80">
              {getSubtitle()}
            </span>
          </h2>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold text-center border ${
            message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <input required type="text" placeholder="Seu Nome" className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:border-brand-red/50 focus:outline-none" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input required type="email" placeholder="Seu E-mail" className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:border-brand-red/50 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
          {view !== 'forgot' && (
            <input required type="password" placeholder="Sua Senha" className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:border-brand-red/50 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <span className="uppercase tracking-widest text-xs">Continuar</span>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-brand-red text-[11px] font-black uppercase tracking-wider hover:underline">
            {view === 'login' ? 'Criar uma conta' : 'Já tenho conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
