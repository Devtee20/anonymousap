import React from 'react';
import { Home, Flame, ShieldAlert, User } from 'lucide-react';

export default function BottomBar({
  currentTab,
  onTabChange,
  isAdmin
}) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-3 bg-[#0d1c2d] border-t border-white/15 shadow-xl z-50 rounded-t-xl sm:hidden">
      
      {/* Home Button */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-95 ${
          currentTab === 'home'
            ? 'text-[#947dff] bg-[#cabeff]/10'
            : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
        }`}
        id="nav-tab-home"
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px] font-medium mt-0.5">Home</span>
      </button>

      {/* Trending Button */}
      <button
        onClick={() => onTabChange('trending')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-95 ${
          currentTab === 'trending'
            ? 'text-[#947dff] bg-[#cabeff]/10'
            : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
        }`}
        id="nav-tab-trending"
      >
        <Flame className="w-5 h-5 animate-pulse text-amber-400" />
        <span className="text-[11px] font-medium mt-0.5">Trending</span>
      </button>

      {/* Admin Button (Either conditional or visible to let them play with it easily!) */}
      <button
        onClick={() => onTabChange('admin')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-95 ${
          currentTab === 'admin'
            ? 'text-[#947dff] bg-[#cabeff]/10'
            : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
        }`}
        id="nav-tab-admin"
      >
        <ShieldAlert className="w-5 h-5 text-purple-400" />
        <span className="text-[11px] font-medium mt-0.5">Admin</span>
      </button>

      {/* Profile Button */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-95 ${
          currentTab === 'profile'
            ? 'text-[#947dff] bg-[#cabeff]/10'
            : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
        }`}
        id="nav-tab-profile"
      >
        <User className="w-5 h-5" />
        <span className="text-[11px] font-medium mt-0.5">Profile</span>
      </button>

    </nav>
  );
}
