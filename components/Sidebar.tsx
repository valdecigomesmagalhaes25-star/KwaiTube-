
import React from 'react';
import { Heart, MessageCircle, Share2, DollarSign } from 'lucide-react';

interface SidebarProps {
  likes: number;
  views: number;
  avatar: string;
}

const Sidebar: React.FC<SidebarProps> = ({ likes, views, avatar }) => {
  return (
    <div className="absolute right-2 bottom-24 flex flex-col items-center gap-6 z-10">
      <div className="relative">
        <img src={avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg" alt="Creator" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white rounded-full p-1">
          <DollarSign size={12} />
        </div>
      </div>

      <button className="flex flex-col items-center group">
        <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full transition group-active:scale-125">
          <Heart className="text-white group-hover:text-red-500 fill-transparent hover:fill-red-500" size={28} />
        </div>
        <span className="text-white text-xs font-bold mt-1 shadow-sm">{likes}</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full">
          <MessageCircle className="text-white" size={28} />
        </div>
        <span className="text-white text-xs font-bold mt-1">Chat</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full">
          <Share2 className="text-white" size={28} />
        </div>
        <span className="text-white text-xs font-bold mt-1">Link</span>
      </button>
      
      <div className="mt-4 flex flex-col items-center opacity-70">
         <span className="text-[10px] text-white uppercase font-black">Views</span>
         <span className="text-xs text-white font-bold">{views}</span>
      </div>
    </div>
  );
};

export default Sidebar;
