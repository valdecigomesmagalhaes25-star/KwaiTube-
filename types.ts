
export interface User {
  id: string;
  name: string;
  avatar: string;
  walletBalance: number;
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
  type: 'watch' | 'view_received';
  timestamp: number;
}
