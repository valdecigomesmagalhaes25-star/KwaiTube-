
import React from 'react';
import { Heart, MessageCircle, Share2, DollarSign } from 'lucide-react';

interface SidebarProps {
  likes: number;
  views: number;
  avatar: string;
}

const Sidebar: React.FC<SidebarProps> = ({ likes, views, avatar }) => {
  return (
    <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-10">
      <div className="relative mb-2">
        <div className="p-0.5 bg-gradient-to-tr from-brand-red via-brand-red to-brand-orange rounded-full shadow-[0_0_15px_rgba(255,8,0,0.3)]">
          <img src={avatar} className="w-12 h-12 rounded-full border-2 border-black object-cover shadow-xl" alt="Creator" />
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-brand-red text-white rounded-full p-1 shadow-md border border-white/20">
          <DollarSign size={10} strokeWidth={4} />
        </div>
      </div>

      <button className="flex flex-col items-center group">
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full transition group-active:scale-125 border border-white/10">
          <Heart className="text-white group-hover:text-brand-red transition-colors" size={26} fill={likes > 1000 ? "currentColor" : "none"} />
        </div>
        <span className="text-white text-[11px] font-black mt-1 drop-shadow-md">{likes}</span>
      </button>

      <button className="flex flex-col items-center group">
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full group-active:scale-110 transition border border-white/10">
          <MessageCircle className="text-white" size={26} />
        </div>
        <span className="text-white text-[11px] font-black mt-1">Chat</span>
      </button>

      <button className="flex flex-col items-center group">
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full group-active:scale-110 transition border border-white/10">
          <Share2 className="text-white" size={26} />
        </div>
        <span className="text-white text-[11px] font-black mt-1">Link</span>
      </button>
      
      <div className="mt-2 flex flex-col items-center opacity-90">
         <div className="bg-brand-red px-2 py-0.5 rounded text-[8px] text-white font-black uppercase tracking-tighter mb-0.5 shadow-md">Views</div>
         <span className="text-xs text-white font-black drop-shadow-lg">{views}</span>
      </div>
    </div>
  );
};

export default Sidebar;
