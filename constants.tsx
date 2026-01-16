
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
  },
  {
    id: '3',
    youtubeId: '6_pru8U2RmM',
    creatorId: 'user3',
    creatorName: 'Chef Gourmet',
    creatorAvatar: 'https://picsum.photos/seed/user3/100/100',
    title: 'A Melhor Receita de 1 Minuto',
    description: 'Sobremesa rápida para quem não tem tempo.',
    views: 3400,
    likes: 890,
    tags: ['comida', 'receita', 'rapido']
  }
];

export const WATCH_REWARD = 0.50; // R$ per video watched
export const CREATOR_REWARD = 0.25; // R$ per view received
