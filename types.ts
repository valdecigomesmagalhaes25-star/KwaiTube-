
export interface User {
  id: string;
  email?: string; // Adicionado para verificação de admin e segurança
  name: string;
  avatar: string;
  walletBalance: number;
  viewerEarnings: number; // Ganhos assistindo
  creatorEarnings: number; // Ganhos produzindo
  totalViewsReceived?: number;
  totalAdsShownOnVideos?: number;
  adFrequency?: number;
  isFollowing?: boolean; // Novo: Indica se o usuário atual segue este perfil
}

export interface Video {
  id: string;
  youtubeId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  tags: string[];
}

export interface RewardEvent {
  amount: number;
  type: 'watch' | 'view_received' | 'ad_watched' | 'creator_ad_bonus';
  timestamp: number;
}
