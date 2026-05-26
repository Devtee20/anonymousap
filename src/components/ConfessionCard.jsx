import React from 'react';
import { MessageSquare, ArrowUp, ArrowDown, Flag } from 'lucide-react';

export default function ConfessionCard({
  post,
  onVote,
  onSelect,
  onReport
}) {
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Relationship':
        return 'bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab]';
      case 'School':
        return 'bg-[#cabeff]/10 border border-[#cabeff]/30 text-[#cabeff]';
      case 'Campus':
        return 'bg-amber-400/10 border border-amber-400/30 text-amber-300';
      case 'Life':
        return 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-300';
      default:
        return 'bg-[#c9c4d8]/10 border border-[#c9c4d8]/30 text-[#c9c4d8]';
    }
  };

  const getVoteScore = () => {
    return post.upvotes - post.downvotes;
  };

  return (
    <article className="bg-[#122131] border border-white/15 p-4 rounded-xl transition-all duration-200 hover:bg-[#1c2b3c] hover:border-white/25 hover:shadow-md flex flex-col justify-between">

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar circle with randomized pattern gradients */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.avatarGradient} opacity-90 border border-white/10 shadow-sm flex items-center justify-center text-xs font-semibold uppercase text-white`}>
            AN
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-sm text-[#d4e4fa] tracking-tight hover:underline cursor-pointer" onClick={() => onSelect(post.id)}>
              Anonymous
            </span>
            <span className="text-xs text-[#c9c4d8]">
              {post.timestamp}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${getCategoryBadgeClass(post.category)}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Main Content Paragraph */}
      <p
        onClick={() => onSelect(post.id)}
        className="text-[#d4e4fa] text-[15px] mb-4 leading-relaxed cursor-pointer hover:text-white transition-colors"
      >
        {post.content}
      </p>

      {/* Bottom Engagement bar */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">

        {/* Voting Widget */}
        <div className="flex items-center gap-2 bg-[#273647]/50 rounded-full px-3 py-1 border border-white/5">
          <button
            onClick={() => onVote(post.id, 'up')}
            className={`flex items-center justify-center active:scale-75 transition-transform ${post.userVote === 'up'
                ? 'text-[#947dff] hover:text-[#cabeff]'
                : 'text-[#c9c4d8] hover:text-[#cabeff]'
              }`}
            title="Upvote confession"
          >
            <ArrowUp className={`w-4 h-4 ${post.userVote === 'up' ? 'fill-current' : ''}`} />
          </button>

          <span className={`text-[13px] font-semibold text-center min-w-[20px] ${post.userVote === 'up'
              ? 'text-[#cabeff]'
              : post.userVote === 'down'
                ? 'text-[#ffb4ab]'
                : 'text-[#d4e4fa]'
            }`}>
            {getVoteScore()}
          </span>

          <button
            onClick={() => onVote(post.id, 'down')}
            className={`flex items-center justify-center active:scale-75 transition-transform ${post.userVote === 'down'
                ? 'text-[#ffb4ab] hover:text-[#ffdad6]'
                : 'text-[#c9c4d8] hover:text-[#ffb4ab]'
              }`}
            title="Downvote confession"
          >
            <ArrowDown className={`w-4 h-4 ${post.userVote === 'down' ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Comment Link & Report */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelect(post.id)}
            className="flex items-center gap-2 text-[#c9c4d8] hover:text-[#d4e4fa] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium">
              {post.comments.length} comments
            </span>
          </button>

          <button
            onClick={() => onReport(post.id)}
            className={`flex items-center gap-1 p-1.5 rounded-full hover:bg-white/5 transition-colors ${post.reports > 0 ? 'text-[#ffb4ab]' : 'text-[#c9c4d8]'
              }`}
            title="Report this post"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </article>
  );
};

