import React from 'react';
import { Shield, Sparkles, Heart, MessageSquare } from 'lucide-react';

export default function LandingPage({ onLogin, onSignup, onExplore }) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#07101f] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,71,255,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(70,166,255,0.14),_transparent_28%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(13,27,48,0.95),transparent)]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-28">
                <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#d4e4fa] shadow-lg shadow-[#0b1220]/50 backdrop-blur">
                            <Shield className="w-4 h-4 text-[#cabeff]" />
                            Secure. Anonymous. Campus-first.
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                                Share your campus stories anonymously,
                                <span className="text-[#947dff]"> without the noise.</span>
                            </h1>
                            <p className="max-w-2xl text-base sm:text-lg leading-8 text-[#c9d3e8]">
                                HushCampus gives students a private campus feed to post confessions, highlight moments, and talk honestly.
                                Moderators keep the community safe while your identity stays protected.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={onSignup}
                                className="inline-flex items-center justify-center rounded-full bg-[#cabeff] px-6 py-3 text-sm font-semibold text-[#32009a] transition hover:brightness-105 active:scale-[0.98]"
                            >
                                Create account
                            </button>
                            <button
                                type="button"
                                onClick={onLogin}
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                onClick={onExplore}
                                className="inline-flex items-center justify-center rounded-full border border-[#947dff]/20 bg-[#0f1f36] px-6 py-3 text-sm text-[#c9d3e8] transition hover:bg-white/5 active:scale-[0.98]"
                            >
                                Explore the feed
                            </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-[#030812]/60">
                                <p className="text-sm font-semibold text-[#cabeff] uppercase tracking-[0.2em]">Anonymous Voice</p>
                                <p className="mt-2 text-sm text-[#d4e4fa] leading-6">Speak freely with verified campus access and full privacy.</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-[#030812]/60">
                                <p className="text-sm font-semibold text-[#cabeff] uppercase tracking-[0.2em]">Trusted Moderation</p>
                                <p className="mt-2 text-sm text-[#d4e4fa] leading-6">Moderators review posts so the feed stays safe and community-first.</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-[#030812]/60">
                                <p className="text-sm font-semibold text-[#cabeff] uppercase tracking-[0.2em]">Campus Pulse</p>
                                <p className="mt-2 text-sm text-[#d4e4fa] leading-6">Discover what your classmates are saying right now.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] border border-white/10 bg-[#0d1c2d]/80 p-8 shadow-2xl shadow-[#050b14]/80 backdrop-blur-xl">
                        <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[#947dff]/20 blur-3xl" />
                        <div className="absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-[#41c7ff]/20 blur-3xl" />
                        <div className="flex items-center justify-between mb-6 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-[#8faae2]">Live Feed Preview</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">Campus moments in motion</h2>
                            </div>
                            <Sparkles className="w-6 h-6 text-[#cabeff]" />
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-3xl border border-white/10 bg-[#122131]/90 p-5">
                                <p className="text-sm text-[#c9d3e8]">“Just found out the lecture hall is serving free coffee after midnight. Battle stations.”</p>
                                <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8faae2]">
                                    <Heart className="w-4 h-4 text-[#ff8fa3]" />
                                    2.1k reactions
                                </div>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-[#122131]/90 p-5">
                                <p className="text-sm text-[#c9d3e8]">“Moderator spotted a fake event flyer. Stay safe & check your campus updates.”</p>
                                <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8faae2]">
                                    <MessageSquare className="w-4 h-4 text-[#7dd3fc]" />
                                    Trusted moderation
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4 text-[#c9d3e8]">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                                <Shield className="w-4 h-4 text-[#cabeff]" /> Verified campus-only access
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                                <Sparkles className="w-4 h-4 text-[#7dd3fc]" /> Clear community guidelines
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="relative z-10 border-t border-white/10 bg-[#07101f]/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-[#c9d3e8] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 HushCampus. Built for honest campus conversations.</p>
                    <div className="flex flex-wrap gap-4">
                        <button type="button" onClick={onLogin} className="transition hover:text-[#cabeff]">Log in</button>
                        <button type="button" onClick={onSignup} className="transition hover:text-[#cabeff]">Sign up</button>
                        <button type="button" onClick={onExplore} className="transition hover:text-[#cabeff]">Explore feed</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
