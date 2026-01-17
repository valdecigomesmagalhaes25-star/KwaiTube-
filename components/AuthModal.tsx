
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
        setMessage({ text: 'Conta criada! Verifique seu e-mail para confirmar.', type: 'success' });
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ text: 'Link de recuperação enviado para o e-mail.', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Ocorreu um erro inesperado.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const socialLoginPlaceholder = (name: string, icon: any, color: string) => (
    <button 
      type="button" 
      onClick={() => alert(`Login com ${name} disponível em breve!`)}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-bold text-sm`}
    >
      {icon}
      <span>Entrar com {name}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-neutral-900 w-full max-w-md rounded-[3rem] p-8 border border-white/10 shadow-[0_0_80px_rgba(255,8,0,0.15)] relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-orange opacity-50"></div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition shadow-lg">
          <X size={20} />
        </button>

        {view !== 'login' && (
          <button onClick={() => setView('login')} className="absolute top-6 left-6 p-2.5 text-neutral-400 hover:text-brand-red transition flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <ArrowLeft size={16} /> Voltar
          </button>
        )}

        <div className="text-center mb-10 mt-4">
          <h2 className="text-4xl font-black text-white italic tracking-tighter">
            {view === 'login' ? 'BEM-VINDO' : view === 'register' ? 'CRIAR CONTA' : 'RECUPERAR'}
            <span className="text-brand-red block not-italic font-extrabold text-sm tracking-[0.3em] mt-1 opacity-80 uppercase">
              {view === 'login' ? 'NO KWAITUBE' : view === 'register' ? 'NOVA JORNADA' : 'ACESSO AO APP'}
            </span>
          </h2>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold text-center border animate-in slide-in-from-top-2 duration-300 ${
            message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand-red transition" size={18} />
              <input
                required
                type="text"
                placeholder="Seu Nome Completo"
                className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-sm text-white focus:outline-none focus:border-brand-red/50 transition font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand-red transition" size={18} />
            <input
              required
              type="email"
              placeholder="Seu E-mail"
              className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-sm text-white focus:outline-none focus:border-brand-red/50 transition font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {view !== 'forgot' && (
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand-red transition" size={18} />
              <input
                required
                type="password"
                placeholder="Sua Senha"
                className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-sm text-white focus:outline-none focus:border-brand-red/50 transition font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {view === 'login' && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => setView('forgot')}
                className="text-[10px] text-neutral-500 font-black uppercase tracking-widest hover:text-brand-red transition"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition shadow-[0_10px_30px_rgba(255,8,0,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <span className="uppercase tracking-widest text-xs">
                {view === 'login' ? 'Entrar Agora' : view === 'register' ? 'Confirmar Cadastro' : 'Enviar Link'}
              </span>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full border-t border-white/5"></div>
            <span className="absolute bg-neutral-900 px-4 text-[9px] text-neutral-600 font-black uppercase tracking-[0.3em]">OU</span>
          </div>

          <div className="space-y-3">
             {socialLoginPlaceholder('Google', <Chrome size={18} className="text-white" />, 'bg-white')}
             {socialLoginPlaceholder('Facebook', <Facebook size={18} className="text-white" fill="currentColor" />, 'bg-blue-600')}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-[11px] font-bold">
            {view === 'login' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
            <button 
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="ml-2 text-brand-red font-black uppercase tracking-wider hover:underline"
            >
              {view === 'login' ? 'Cadastre-se' : 'Fazer Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
