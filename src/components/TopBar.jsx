import React, { useState } from 'react';
import { Shield, ArrowLeft, Bell, User, LogOut, Menu } from 'lucide-react';

export default function TopBar({
  view,
  onNavigate,
  onLogin,
  onSignup,
  onOpenCompose,
  session,
  onLogout,
  onBackToFeed
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full z-50 bg-[#122131] border-b border-white/15 h-16">
      <div className="flex items-center justify-between px-4 h-full w-full max-w-7xl mx-auto">

        {/* Left Side: Brand & Navigation */}
        <div className="flex items-center gap-2">
          {view === 'detail' && (
            <button
              onClick={onBackToFeed}
              className="mr-1 p-2 rounded-full hover:bg-white/5 active:scale-95 transition-all text-[#cabeff]"
              id="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => {
              if (!session) {
                onNavigate('landing');
              }
            }}
            className={`flex items-center gap-2 ${!session ? 'cursor-pointer group' : 'cursor-default'}`}
          >
            <Shield className="w-6 h-6 text-[#cabeff] fill-[#cabeff]/10 group-hover:scale-105 transition-transform" />
            <h1 className="font-semibold text-xl tracking-tighter text-[#cabeff] flex items-center gap-2">
              HushCampus
              {view === 'admin' && (
                <span className="ml-1 bg-[#cabeff]/10 text-[#cabeff] px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                  Admin
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Right Side: Operational Actions */}
        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <div className="hidden min-[690px]:flex flex-wrap items-center gap-2">
                <button
                  onClick={onLogin}
                  className="min-w-[5.5rem] whitespace-nowrap text-xs bg-white/5 hover:bg-white/10 text-[#d4e4fa] px-3 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={onSignup}
                  className="min-w-[5.5rem] whitespace-nowrap text-xs bg-[#cabeff] text-[#32009a] px-3 py-1.5 rounded-full transition-all hover:brightness-110 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex min-[690px]:hidden items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-[#d4e4fa] transition hover:bg-white/10 active:scale-95"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              {isMobileMenuOpen && (
                <div className="absolute right-4 top-16 z-40 flex w-11/12 max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-[#122131]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur min-[690px]:hidden">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogin();
                    }}
                    className="w-full rounded-full bg-white/5 px-4 py-3 text-left text-sm text-[#d4e4fa] hover:bg-white/10"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onSignup();
                    }}
                    className="w-full rounded-full bg-[#cabeff] px-4 py-3 text-left text-sm font-semibold text-[#32009a] hover:brightness-110"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </>
          ) : view === 'feed' && (
            <div className="flex items-center gap-2 relative">
              {session?.isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-xs bg-white/5 hover:bg-white/10 text-[#d4e4fa] px-3 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => {
                  if (session) {
                    onOpenCompose();
                  } else {
                    onLogin();
                  }
                }}
                className="bg-[#cabeff] text-[#32009a] hover:bg-[#947dff] hover:text-white px-4 py-1.5 rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer"
                id="post-compose-trigger"
              >
                Post
              </button>

              {session ? (
                <div className="relative flex items-center ml-1">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-tr ${session.user?.avatarGradient || 'from-indigo-500 to-pink-500'} flex items-center justify-center border border-white/15 hover:border-white/30 transition-all select-none active:scale-95 cursor-pointer text-[10px] font-bold text-white uppercase`}
                    title="Profile Menu"
                  >
                    {session.user?.displayName ? session.user.displayName.substring(0, 2) : 'AN'}
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-10 w-52 bg-[#122131] border border-white/15 rounded-xl shadow-2xl py-3 px-4 z-50 animate-fade-in flex flex-col gap-2">
                        <div className="flex flex-col gap-0.5 border-b border-white/10 pb-2">
                          <p className="text-xs text-[#cabeff] font-semibold truncate">
                            {session.user?.displayName || 'Anonymous'}
                          </p>
                          <p className="text-[10px] text-[#c9c4d8] truncate font-mono">
                            {session.user?.email || 'private@session'}
                          </p>
                          <span className="mt-1 self-start text-[8px] bg-white/5 text-[#c9c4d8] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                            {session.user?.role || 'User'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onLogout();
                          }}
                          className="flex items-center gap-2 text-left w-full text-xs text-[#ffb4ab] hover:bg-white/5 py-2 px-2 rounded-lg transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('auth')}
                  className="text-xs bg-white/5 hover:bg-white/10 text-[#d4e4fa] px-3 py-1.5 rounded-full transition-all cursor-pointer ml-1"
                >
                  Sign In
                </button>
              )}
            </div>
          )}

          {view === 'detail' && (
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                  alert("Link copied to clipboard! You can share this confession with classmates.");
                });
              }}
              className="px-4 py-1.5 bg-[#cabeff]/10 hover:bg-[#cabeff]/20 text-[#cabeff] rounded-xl font-semibold text-sm transition-all active:scale-95"
            >
              Share
            </button>
          )}

          {view === 'admin' && (
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full text-[#c9c4d8] hover:bg-white/5 hover:text-[#d4e4fa] transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffb4ab] rounded-full animate-pulse" />
              </button>

              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-[#d4e4fa] font-medium">Mod team</p>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-[#ffb4ab] hover:underline"
                  >
                    Exit Admin
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#273647] flex items-center justify-center border border-white/10">
                  <User className="w-4 h-4 text-[#cabeff]" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
