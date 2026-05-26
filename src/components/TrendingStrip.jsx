import React, { useRef, useState } from 'react';
import { Flame, Sparkles, Frown, Laptop } from 'lucide-react';

export default function TrendingStrip({ trends = [], onTrendClick }) {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const iconMap = [
    <Sparkles className="w-4 h-4 text-[#cabeff]" />,
    <Frown className="w-4 h-4 text-[#ffb4ab]" />,
    <Laptop className="w-4 h-4 text-[#c4c6d3]" />
  ];

  /* Drag-to-scroll gestures */
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section className="mb-6 select-none shadow-sm pb-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Flame className="w-5 h-5 fill-current" />
        </span>
        <h2 className="font-semibold text-lg text-[#d4e4fa] tracking-tight">Trending Now</h2>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-4 custom-scrollbar pb-2 cursor-grab active:cursor-grabbing ${isDown ? 'active' : ''
          }`}
      >
        {trends.length > 0 ? (
          trends.map((trend, index) => (
            <div
              key={trend.id}
              onClick={() => onTrendClick?.(trend.content)}
              className="flex-shrink-0 w-64 glass-card p-4 rounded-xl border border-white/10 hover:border-white/25 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${trend.gradient ?? 'from-[#6d28d9] to-[#1e40af]'} flex items-center justify-center border border-white/15`}>
                  {trend.icon ?? iconMap[index % iconMap.length]}
                </div>
                <Flame className="w-4 h-4 text-[#cabeff] fill-[#cabeff]/30" />
              </div>

              <p className="text-sm text-[#d4e4fa] font-normal leading-snug line-clamp-2">
                {trend.content}
              </p>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-64 glass-card p-4 rounded-xl border border-white/10 text-[#c9c4d8]">
            No trending posts available yet. Create or vote on posts to build a trending feed.
          </div>
        )}
      </div>
    </section>
  );
}
