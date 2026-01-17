
import React, { useState, useEffect } from 'react';
import { 
  X, Users, DollarSign, Settings, CheckCircle, Clock, 
  TrendingUp, ShieldCheck, Save, Loader2, AlertCircle, Play,
  Tv, Eye, Layout, Smartphone, FlaskConical, Rocket, Power, Gift,
  Zap, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { 
  WATCH_REWARD, 
  CREATOR_AD_REWARD, 
  ADMOB_APP_ID, 
  ADMOB_BANNER_ID, 
  ADMOB_INTERSTITIAL_ID,
  ADMOB_REWARDED_INTERSTITIAL_ID,
  ADMOB_REWARDED_ID,
  ADMOB_NATIVE_ID,
  ADMOB_APP_OPEN_ID
} from '../constants';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'ads' | 'config'>('stats');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  // Configurações AdMob
  const [adConfig, setAdConfig] = useState({
    adsEnabled: true,
    environment: 'production' as 'test' | 'production',
    activeFormats: {
      banner: true,
      interstitial: true,
      rewarded: true,
      rewardedInterstitial: true,
      native: true,
      appOpen: true
    },
    appId: ADMOB_APP_ID,
    bannerId: ADMOB_BANNER_ID,
    interstitialId: ADMOB_INTERSTITIAL_ID,
    rewardedInterstitialId: ADMOB_REWARDED_INTERSTITIAL_ID,
    rewardedId: ADMOB_REWARDED_ID,
    nativeId: ADMOB_NATIVE_ID,
    appOpenId: ADMOB_APP_OPEN_ID
  });

  const [rewardConfig, setRewardConfig] = useState({
    viewerReward: WATCH_REWARD,
    creatorReward: CREATOR_AD_REWARD,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'users') {
      setLoading(true);
      try {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulação de salvamento das configurações de publicidade
    setTimeout(() => {
      setLoading(false);
      alert("Configurações de publicidade atualizadas com sucesso!");
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black z-[250] flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      <header className="bg-neutral-900 border-b border-white/10 p-4 sm:p-6 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
            <ShieldCheck className="text-amber-500" size={24} />
          </div>
          <div>
            <h1 className="text-white font-black italic text-lg sm:text-xl leading-none">PAINEL ADMIN</h1>
            <p className="text-[8px] text-amber-500 font-black uppercase tracking-[0.2em] mt-1">Master Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-red/20 active:scale-95 transition-all"
          >
            <Play size={14} fill="currentColor" />
            <span className="hidden xs:inline">Ver Vídeos</span>
            <span className="xs:hidden">Sair</span>
          </button>
          
          <button onClick={onClose} className="p-2.5 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
      </header>

      <nav className="flex bg-neutral-900 border-b border-white/5">
        {[
          { id: 'stats', label: 'Dashboard', icon: TrendingUp },
          { id: 'users', label: 'Usuários', icon: Users },
          { id: 'ads', label: 'Publicidade', icon: Tv },
          { id: 'config', label: 'Financeiro', icon: DollarSign },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'bg-amber-500/10 text-amber-500 border-b-2 border-amber-500' : 'text-neutral-500'}`}
          >
            <tab.icon size={18} />
            <span className="text-[9px] font-black uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-6 pb-24 bg-black">
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900 p-6 rounded-3xl border border-white/5">
                <p className="text-neutral-500 text-[9px] font-black uppercase mb-1">Faturamento Estimado</p>
                <p className="text-2xl font-black text-white italic">R$ 14.250,00</p>
              </div>
              <div className="bg-neutral-900 p-6 rounded-3xl border border-white/5">
                <p className="text-neutral-500 text-[9px] font-black uppercase mb-1">Saques Pendentes</p>
                <p className="text-2xl font-black text-amber-500 italic">R$ 840,12</p>
              </div>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] flex items-center gap-4">
               <AlertCircle className="text-amber-500" />
               <p className="text-xs text-neutral-300 leading-tight">
                 Publicidade Master: <b className={`uppercase ${adConfig.adsEnabled ? 'text-green-500' : 'text-red-500'}`}>{adConfig.adsEnabled ? 'Ligada' : 'Desligada'}</b> no ambiente de <b className="text-amber-500 uppercase">{adConfig.environment}</b>.
               </p>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {/* INTERRUPTOR MESTRE */}
            <div className={`p-6 rounded-[2rem] border transition-all ${adConfig.adsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${adConfig.adsEnabled ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                    <Power size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-black italic text-lg leading-none">STATUS GLOBAL ADS</h3>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase mt-1">Ligar/Desligar AdMob em todo o App</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAdConfig({...adConfig, adsEnabled: !adConfig.adsEnabled})}
                  className={`w-14 h-8 rounded-full relative transition-colors ${adConfig.adsEnabled ? 'bg-green-500' : 'bg-neutral-800'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${adConfig.adsEnabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            {/* SELETOR DE AMBIENTE */}
            <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-white font-black text-sm italic mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Layout size={18} className="text-amber-500" /> Ambiente de Exibição
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setAdConfig({...adConfig, environment: 'test'})}
                  className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${adConfig.environment === 'test' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-black border-white/5 text-neutral-500'}`}
                >
                  <FlaskConical size={32} />
                  <span className="font-black text-[10px] uppercase">MODO TESTE</span>
                </button>
                <button 
                  onClick={() => setAdConfig({...adConfig, environment: 'production'})}
                  className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${adConfig.environment === 'production' ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-black border-white/5 text-neutral-500'}`}
                >
                  <Rocket size={32} />
                  <span className="font-black text-[10px] uppercase">PRODUÇÃO</span>
                </button>
              </div>
            </div>

            {/* KIT DE ANÚNCIOS (FORMATOS) */}
            <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-white font-black text-sm italic mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Smartphone size={18} className="text-brand-orange" /> Kit de Ativação
              </h3>
              
              <div className="space-y-3">
                {[
                  { id: 'appOpen', label: 'Abertura do App', desc: 'Exibido ao iniciar o app', icon: Rocket },
                  { id: 'banner', label: 'Banners Ativos', desc: 'Anúncios fixos no rodapé', icon: Layout },
                  { id: 'interstitial', label: 'Intersticiais Ativos', desc: 'Anúncios de tela cheia entre vídeos', icon: Smartphone },
                  { id: 'rewarded', label: 'Premiados Ativos', desc: 'Anúncios que dão moedas', icon: Gift },
                  { id: 'rewardedInterstitial', label: 'Intersticial Premiado', desc: 'Premiado de alto impacto', icon: Zap },
                  { id: 'native', label: 'Anúncios Nativos', desc: 'Integrados ao design', icon: ImageIcon },
                ].map((format) => (
                  <label key={format.id} className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 cursor-pointer active:scale-95 transition">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${ (adConfig.activeFormats as any)[format.id] ? 'text-amber-500' : 'text-neutral-700'}`}>
                         <format.icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white italic">{format.label}</p>
                        <p className="text-[8px] text-neutral-500 font-bold uppercase">{format.desc}</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 accent-brand-red rounded-lg"
                      checked={(adConfig.activeFormats as any)[format.id]}
                      onChange={(e) => setAdConfig({
                        ...adConfig, 
                        activeFormats: { ...adConfig.activeFormats, [format.id]: e.target.checked }
                      })}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* CREDENCIAIS ADMOB */}
            <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-white font-black text-sm italic mb-6 uppercase tracking-widest">IDs AdMob (Produção)</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">App ID</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.appId}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">App Open Ad Unit (Abertura)</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.appOpenId}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">Banner Ad Unit</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.bannerId}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">Interstitial Ad Unit</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.interstitialId}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">Rewarded Ad Unit (Premiado)</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.rewardedId}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">Native Ad Unit (Nativo)</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.nativeId}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block">Rewarded Interstitial ID</label>
                  <input 
                    type="text" readOnly
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-[9px] text-neutral-400 font-mono"
                    value={adConfig.rewardedInterstitialId}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> ATUALIZAR PUBLICIDADE</>}
            </button>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-white font-black text-lg italic mb-6">Financeiro</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-neutral-500 font-black uppercase mb-2 block">Ganhos Espectador</label>
                  <input type="number" step="0.00001" className="w-full bg-black border border-white/10 rounded-2xl py-5 px-6 text-white font-black" value={rewardConfig.viewerReward} onChange={(e) => setRewardConfig({...rewardConfig, viewerReward: parseFloat(e.target.value)})} />
                </div>
                <button onClick={handleSave} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl">SALVAR GANHOS</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-3">
            {loading ? <Loader2 className="animate-spin mx-auto text-amber-500" /> : users.map(u => (
                <div key={u.id} className="bg-neutral-900 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar_url || `https://picsum.photos/seed/${u.id}/100/100`} className="w-10 h-10 rounded-full" />
                    <p className="text-xs font-black text-white">{u.name || 'Usuário'}</p>
                  </div>
                  <p className="text-sm font-black text-green-500 italic">R$ {(u.viewer_earnings || 0).toFixed(4)}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
