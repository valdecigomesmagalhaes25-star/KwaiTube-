
import { Video } from './types';

export const INITIAL_VIDEOS: Video[] = [
  {
    id: '1',
    youtubeId: '3X0-85zT970',
    creatorId: 'user1',
    creatorName: 'Tech Master',
    creatorAvatar: 'https://picsum.photos/seed/user1/100/100',
    title: 'Dicas Incríveis de React',
    description: 'Aprenda a criar apps rápidos com React 18 e Gemini!',
    views: 1200,
    likes: 450,
    tags: ['react', 'coding', 'tech']
  },
  {
    id: '2',
    youtubeId: 'pS-gbqVPaW8',
    creatorId: 'user2',
    creatorName: 'Viagem & Aventura',
    creatorAvatar: 'https://picsum.photos/seed/user2/100/100',
    title: 'Paraíso Escondido no Brasil',
    description: 'Você não vai acreditar que este lugar existe.',
    views: 8500,
    likes: 2100,
    tags: ['viagem', 'natureza', 'brasil']
  }
];

// Valores de recompensa
export const WATCH_REWARD = 0.00250; 
export const AD_WATCH_REWARD = 0.00250; 
export const CREATOR_AD_REWARD = 0.00250; 
export const ADMIN_EMAIL = "valdecigomesmagalhaes25@gmail.com";

// Configurações AdMob Master (PRODUÇÃO)
export const ADMOB_APP_ID = "ca-app-pub-5575507868796634~2975384133";
export const ADMOB_BANNER_ID = "ca-app-pub-5575507868796634/3059144610";
export const ADMOB_INTERSTITIAL_ID = "ca-app-pub-5575507868796634/8582740515";
export const ADMOB_REWARDED_INTERSTITIAL_ID = "ca-app-pub-5575507868796634/7485281260";
export const ADMOB_REWARDED_ID = "ca-app-pub-5575507868796634/8993804051";
export const ADMOB_NATIVE_ID = "ca-app-pub-5575507868796634/2574917128";
export const ADMOB_APP_OPEN_ID = "ca-app-pub-5575507868796634/2205227949";

// IDs de Teste Padrão do Google (para segurança durante desenvolvimento)
export const ADMOB_TEST_BANNER = "ca-app-pub-3940256099942544/6300978111";
export const ADMOB_TEST_INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712";
export const ADMOB_TEST_REWARDED_INTERSTITIAL = "ca-app-pub-3940256099942544/5354046379";
export const ADMOB_TEST_REWARDED = "ca-app-pub-3940256099942544/5224354917";
export const ADMOB_TEST_NATIVE = "ca-app-pub-3940256099942544/2247696110";
export const ADMOB_TEST_APP_OPEN = "ca-app-pub-3940256099942544/9257395915";
