import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ThumbsUp,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Plus,
  User,
  LogOut,
  Sparkles,
  Send,
  Shield,
  Fingerprint,
  AlertTriangle
} from 'lucide-react';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import TrendingStrip from './components/TrendingStrip';
import ConfessionCard from './components/ConfessionCard';
import ComposeModal from './components/ComposeModal';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';
import LandingPage from './components/LandingPage';

export default function App() {
  // Navigation & Core View States
  const [view, setView] = useState('landing');
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  // Interactive Modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // App Feed Custom Sort filter tab
  const [sortTab, setSortTab] = useState('Top Voted');

  // Auth Session state
  const [session, setSession] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);

  // Confessions and comment list master data
  const [posts, setPosts] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);

  // Local Additives custom comment states
  const [commentInput, setCommentInput] = useState('');

  // Skeleton active loader simulation state on initial flow
  const [isLoading, setIsLoading] = useState(false);
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const apiFetch = async (path, options = {}) => {
    const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://anonymousapp-bn6c.onrender.com');
    const { token, headers: customHeaders, ...fetchOptions } = options;
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    const accessToken = token || session?.accessToken;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      credentials: 'include',
      ...fetchOptions,
      headers
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.message || 'API request failed.');
    }

    return payload;
  };

  const loadPosts = async ({ overrideToken, nextPage = 1, replace = false } = {}) => {
    setLoadingPosts(true);
    try {
      const postsPage = await apiFetch(`/api/posts?page=${nextPage}&limit=${pageSize}`, { token: overrideToken });
      if (replace) setPosts(postsPage);
      else setPosts((cur) => [...cur, ...postsPage]);
      setHasMore(postsPage.length === pageSize);
      setPage(nextPage);
    } catch (error) {
      console.error('Post load error:', error);
      if (replace) setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadTrending = async () => {
    try {
      const trends = await apiFetch('/api/posts/trending');
      setTrendingItems(trends);
    } catch (error) {
      console.error('Trending load error:', error);
      setTrendingItems([]);
    }
  };

  useEffect(() => {
    const savedSession = localStorage.getItem('hushcampus_session');

    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      const safeSession = {
        accessToken: parsedSession.accessToken,
        isAdmin: parsedSession.isAdmin || false,
        isSuperAdmin: parsedSession.isSuperAdmin || false,
        user: parsedSession.user || {
          email: parsedSession.email || 'guest@university.edu',
          displayName: parsedSession.displayName || 'Anonymous Guest',
          avatarGradient: parsedSession.avatarGradient || 'from-blue-500 to-indigo-500',
          role: parsedSession.role || 'guest'
        }
      };
      setSession(safeSession);
      const role = safeSession.user?.role;
      const shouldGoToAdmin = safeSession.isAdmin || role === 'moderator' || role === 'superadmin';
      setView(shouldGoToAdmin ? 'admin' : 'feed');
      setCurrentTab(shouldGoToAdmin ? 'admin' : 'home');
      loadPosts({ overrideToken: safeSession.accessToken, nextPage: 1, replace: true });
    } else {
      loadPosts({ nextPage: 1, replace: true });
    }

    loadTrending();
  }, []);

  const updatePostState = (updatedPost) => {
    setPosts((currentPosts) => currentPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const loadAdminData = async () => {
    if (!session?.isAdmin) return;

    try {
      const metrics = await apiFetch('/api/admin/metrics');
      setAdminMetrics(metrics);
      if (session?.isSuperAdmin) {
        const users = await apiFetch('/api/admin/users');
        setAdminUsers(users);
      }
    } catch (error) {
      console.error('Admin data load error:', error);
    }
  };

  useEffect(() => {
    if (view === 'admin' && session?.isAdmin) {
      loadAdminData();
    }
  }, [view, session?.accessToken]);

  const handleLoginSuccess = (sessionData) => {
    const safeSession = {
      accessToken: sessionData.accessToken,
      isAdmin: sessionData.user?.isAdmin || sessionData.isAdmin || false,
      isSuperAdmin: sessionData.user?.isSuperAdmin || sessionData.isSuperAdmin || false,
      user: sessionData.user || {
        email: sessionData.email || 'guest@university.edu',
        displayName: sessionData.displayName || 'Anonymous Guest',
        avatarGradient: sessionData.avatarGradient || 'from-blue-500 to-indigo-500',
        role: sessionData.role || 'guest'
      }
    };
    setSession(safeSession);
    localStorage.setItem('hushcampus_session', JSON.stringify(safeSession));
    loadPosts({ overrideToken: safeSession.accessToken, nextPage: 1, replace: true });

    // Smooth loader entry Simulation to make the client look outstandingly polished!
    setIsLoading(true);
    const role = safeSession.user?.role;
    const shouldGoToAdmin = safeSession.isAdmin || role === 'moderator' || role === 'superadmin';
    setView(shouldGoToAdmin ? 'admin' : 'feed');
    setCurrentTab(shouldGoToAdmin ? 'admin' : 'home');
    setTimeout(() => {
      setIsLoading(false);
    }, 850);
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout failed on server, clearing locally anyway.', error);
    }
    setSession(null);
    localStorage.removeItem('hushcampus_session');
    setView('auth');
    setCurrentTab('home');
  };

  // Upvote/Downvote actions
  const handleVote = async (postId, direction) => {
    if (!session) {
      setView('auth');
      return;
    }

    try {
      const updatedPost = await apiFetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ direction })
      });
      updatePostState(updatedPost);
    } catch (error) {
      alert(error.message || 'Unable to process vote.');
      console.error(error);
    }
  };

  // Compose new post callback submitter
  const handleAddConfession = async (content, category) => {
    try {
      const newPost = await apiFetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content, category })
      });
      setPosts((currentPosts) => [newPost, ...currentPosts]);
    } catch (error) {
      alert(error.message || 'Unable to post confession.');
      console.error(error);
    }
  };

  // Reporting actions
  const handleReportPost = async (postId) => {
    if (!session) {
      setView('auth');
      return;
    }

    try {
      const updatedPost = await apiFetch(`/api/posts/${postId}/report`, {
        method: 'POST'
      });
      updatePostState(updatedPost);
      alert('Thank you. This confession has been flagged for review by campus moderators.');
    } catch (error) {
      alert(error.message || 'Unable to report the confession.');
      console.error(error);
    }
  };

  // Add comment reply
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedPostId) return;

    if (!session) {
      setView('auth');
      return;
    }

    try {
      const updatedPost = await apiFetch(`/api/posts/${selectedPostId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: commentInput.trim() })
      });
      updatePostState(updatedPost);
      setCommentInput('');
    } catch (error) {
      alert(error.message || 'Unable to add comment.');
      console.error(error);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!selectedPostId) return;
    if (!session) {
      setView('auth');
      return;
    }

    try {
      const updatedPost = await apiFetch(`/api/posts/${selectedPostId}/comments/${commentId}/like`, {
        method: 'POST'
      });
      updatePostState(updatedPost);
    } catch (error) {
      alert(error.message || 'Unable to update comment like.');
      console.error(error);
    }
  };

  // Admin Keep Callback function
  const handleAdminKeep = async (postId) => {
    if (!session?.isAdmin) {
      alert('Moderator access is required to keep posts.');
      return;
    }

    try {
      const updatedPost = await apiFetch(`/api/posts/${postId}/admin/keep`, {
        method: 'POST'
      });
      updatePostState(updatedPost);
      alert('Post approved. Reports cleared.');
    } catch (error) {
      alert(error.message || 'Unable to approve post.');
      console.error(error);
    }
  };

  // Admin Delete Callback function
  const handleAdminDelete = async (postId) => {
    if (!session?.isAdmin) {
      alert('Moderator access is required to delete posts.');
      return;
    }

    try {
      await apiFetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
      if (selectedPostId === postId) {
        setSelectedPostId(null);
        setView('feed');
      }
    } catch (error) {
      alert(error.message || 'Unable to delete post.');
      console.error(error);
    }
  };

  const handleCreateModerator = async ({ moderatorId, password }) => {
    if (!session?.isSuperAdmin) {
      alert('Only the super admin can create moderators.');
      return;
    }

    try {
      const result = await apiFetch('/api/admin/moderators', {
        method: 'POST',
        body: JSON.stringify({ moderatorId, password })
      });
      alert(result.message || 'Moderator created successfully.');
      await loadAdminData();
    } catch (error) {
      alert(error.message || 'Unable to create moderator.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!session?.isSuperAdmin) {
      alert('Only the super admin can delete users.');
      return;
    }

    try {
      await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      setAdminUsers((currentUsers) => currentUsers.filter((user) => user._id !== userId));
      alert('User deleted successfully.');
    } catch (error) {
      alert(error.message || 'Unable to delete user.');
    }
  };

  // Click on organic trend card text fills in composition helper
  const handleTrendingComposeFill = (textString) => {
    setIsComposeOpen(true);
  };

  // Get current active detailed post
  const activeDetailPost = posts.find(p => p.id === selectedPostId);

  // Filter & tab trigger navigation functions
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab === 'admin') {
      setView('admin');
    } else if (tab === 'home' || tab === 'trending' || tab === 'profile') {
      setView('feed');
    }
  };

  // Computed post lists for feed layouts
  const getProcessedPosts = () => {
    let list = [...posts];

    // Profile view does not rely on backend display names; keep listing unfiltered.

    // Sort tabs filter logic
    if (sortTab === 'Top Voted') {
      return list.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    }
    if (sortTab === 'Trending') {
      return list.sort((a, b) => (b.comments.length + b.reports) - (a.comments.length + a.reports));
    }
    // Default 'Latest'
    return list;
  };

  const processedPosts = getProcessedPosts();

  // Selected Detail Post category styles helper
  const getDetailCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Relationship':
        return 'bg-pink-500/20 border border-pink-500/30 text-pink-400';
      case 'School':
        return 'bg-[#cabeff]/20 border border-[#cabeff]/30 text-[#cabeff]';
      case 'Campus':
        return 'bg-amber-400/20 border border-amber-400/30 text-amber-300';
      case 'Life':
        return 'bg-emerald-400/25 border border-emerald-400/30 text-emerald-300';
      default:
        return 'bg-white/10 border border-white/20 text-[#c9c4d8]';
    }
  };

  return (
    <div className="bg-[#051424] text-[#d4e4fa] min-h-screen pb-24 md:pb-8 selection:bg-[#cabeff]/30 selection:text-[#32009a]">

      {/* Dynamic Global Top Bar */}
      <TopBar
        view={view}
        onNavigate={(targetView) => {
          setView(targetView);
          if (targetView === 'feed') setCurrentTab('home');
          if (targetView === 'admin') setCurrentTab('admin');
        }}
        onLogin={() => {
          setAuthMode('login');
          setView('auth');
        }}
        onSignup={() => {
          setAuthMode('signup');
          setView('auth');
        }}
        onBackToFeed={() => {
          setView('feed');
          setSelectedPostId(null);
        }}
        onOpenCompose={() => setIsComposeOpen(true)}
        session={session}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <AnimatePresence mode="wait">

        {/* VIEW 1: AUTHENTICATION LOGIN AT ENTRY */}
        {view === 'auth' && (
          <motion.div
            key="auth-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <AuthScreen
              key={authMode}
              initialAuthType={authMode}
              onLoginSuccess={handleLoginSuccess}
            />
          </motion.div>
        )}

        {/* VIEW 0: LANDING PAGE FOR NEW VISITORS */}
        {view === 'landing' && (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full"
          >
            <LandingPage
              onLogin={() => {
                setAuthMode('login');
                setView('auth');
              }}
              onSignup={() => {
                setAuthMode('signup');
                setView('auth');
              }}
              onExplore={() => setView('feed')}
            />
          </motion.div>
        )}

        {/* LOADING ANIMATED OVERLAY SIMULATION */}
        {isLoading && (
          <div className="fixed inset-0 bg-[#051424] z-50 flex flex-col justify-center items-center gap-4">
            <Shield className="w-12 h-12 text-[#cabeff] animate-bounce" />
            <span className="text-xs font-semibold tracking-widest text-[#cabeff] uppercase animate-pulse">
              Entering the campus shadows...
            </span>
          </div>
        )}

        {/* VIEW 2: HOME FEED / LISTS */}
        {!isLoading && view === 'feed' && (
          <motion.div
            key="feed-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-20 max-w-2xl mx-auto px-4"
          >

            {/* Show Header Welcome Notification when loaded */}
            {currentTab === 'profile' && (
              <div className="glass-card rounded-2xl p-6 mb-6 border-l-4 border-[#947dff]">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-600 flex items-center justify-center text-lg font-bold shadow-md uppercase`}>
                    AN
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Anonymous
                      {session?.isAdmin && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                          Moderator
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#c9c4d8]">Private session</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="text-[11px] text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/10 rounded px-2 py-0.5 flex items-center gap-1 transition-colors"
                      >
                        <LogOut className="w-3 h-3" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trending Horizontal Section, only shown on main views */}
            {(currentTab === 'home' || currentTab === 'trending') && (
              <TrendingStrip trends={trendingItems} onTrendClick={handleTrendingComposeFill} />
            )}

            {/* Selection tab filters */}
            <nav className="flex gap-4 mb-6 border-b border-white/10 pb-2 select-none">
              <button
                onClick={() => setSortTab('Latest')}
                className={`text-xs font-semibold tracking-wide py-2 px-1 transition-all ${sortTab === 'Latest'
                  ? 'text-[#cabeff] border-b-2 border-[#cabeff]'
                  : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
                  }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortTab('Top Voted')}
                className={`text-xs font-semibold tracking-wide py-2 px-1 transition-all ${sortTab === 'Top Voted'
                  ? 'text-[#cabeff] border-b-2 border-[#cabeff]'
                  : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
                  }`}
              >
                Top Voted
              </button>
              <button
                onClick={() => setSortTab('Trending')}
                className={`text-xs font-semibold tracking-wide py-2 px-1 transition-all ${sortTab === 'Trending'
                  ? 'text-[#cabeff] border-b-2 border-[#cabeff]'
                  : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
                  }`}
              >
                Trending
              </button>
            </nav>

            {/* Confession Cards Feed List */}
            <div className="flex flex-col gap-4">
              {processedPosts.length === 0 ? (
                <div className="glass-card text-center p-8 rounded-xl border border-white/5 flex flex-col items-center gap-3">
                  <p className="text-[#c9c4d8] font-medium">No student confessions found here yet!</p>
                  <button
                    onClick={() => setIsComposeOpen(true)}
                    className="bg-[#cabeff]/10 hover:bg-[#cabeff]/20 text-[#cabeff] text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Write the first one anonymous
                  </button>
                </div>
              ) : (
                processedPosts.map((post) => (
                  <ConfessionCard
                    key={post.id}
                    post={post}
                    onVote={handleVote}
                    onSelect={(id) => {
                      setSelectedPostId(id);
                      setView('detail');
                    }}
                    onReport={handleReportPost}
                  />
                ))
              )}

              {hasMore && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => loadPosts({ nextPage: page + 1 })}
                    disabled={loadingPosts}
                    className="px-4 py-2 rounded-lg bg-[#cabeff] text-[#32009a] font-semibold hover:brightness-110"
                  >
                    {loadingPosts ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}

              {/* Skeleton Visual loaders Simulation for aesthetics, matching screen 1 mockup */}
              <div className="animate-pulse space-y-4 pt-4 opacity-30 select-none pointer-events-none">
                <div className="bg-[#122131]/20 h-36 w-full rounded-xl p-4 border border-white/5">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#273647]/50" />
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="h-3 w-24 bg-[#273647]/50 rounded" />
                      <div className="h-2.5 w-16 bg-[#273647]/30 rounded" />
                    </div>
                  </div>
                  <div className="h-3.5 w-full bg-[#273647]/40 rounded mb-2.5" />
                  <div className="h-3.5 w-2/3 bg-[#273647]/40 rounded" />
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* VIEW 3: DISCOVERY POST DETAIL (WITH WORKING REPLY COMMENTS) */}
        {!isLoading && view === 'detail' && activeDetailPost && (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pt-20 px-4 max-w-2xl mx-auto pb-16"
          >
            {/* Post Hero section */}
            <article className="glass-card rounded-2xl p-6 md:p-8 mb-6 border border-white/10 confession-gradient">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${activeDetailPost.avatarGradient} flex items-center justify-center border border-white/10 shadow-sm text-sm uppercase text-white font-bold`}>
                    AN
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Anonymous</p>
                    <p className="text-xs text-[#c9c4d8] font-mono">{activeDetailPost.timestamp} • University Central</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDetailCategoryBadgeClass(activeDetailPost.category)}`}>
                  {activeDetailPost.category}
                </span>
              </div>

              {/* Detail Paragraph content styled to premium spec */}
              <p className="text-lg md:text-xl text-white font-normal leading-relaxed mb-6">
                {activeDetailPost.content}
              </p>

              {/* Large Vote Widget matching layout spec 2 */}
              <div className="flex flex-col items-center justify-center py-5 border-y border-white/5 bg-[#122131]/30 rounded-xl">
                <div className="flex items-center gap-10">

                  {/* Upvote button */}
                  <button
                    onClick={() => handleVote(activeDetailPost.id, 'up')}
                    className={`flex flex-col items-center gap-1 group transition-all active:scale-90 ${activeDetailPost.userVote === 'up'
                      ? 'text-[#947dff]'
                      : 'text-[#c9c4d8] hover:text-[#cabeff]'
                      }`}
                  >
                    <ArrowUp className={`w-8 h-8 ${activeDetailPost.userVote === 'up' ? 'fill-current' : ''}`} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Upvote</span>
                  </button>

                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-[#cabeff] tracking-tight">
                      {activeDetailPost.upvotes - activeDetailPost.downvotes}
                    </span>
                    <p className="text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider mt-0.5">Confessions</p>
                  </div>

                  {/* Downvote button */}
                  <button
                    onClick={() => handleVote(activeDetailPost.id, 'down')}
                    className={`flex flex-col items-center gap-1 group transition-all active:scale-90 ${activeDetailPost.userVote === 'down'
                      ? 'text-[#ffb4ab]'
                      : 'text-[#c9c4d8] hover:text-[#ffb4ab]'
                      }`}
                  >
                    <ArrowDown className={`w-8 h-8 ${activeDetailPost.userVote === 'down' ? 'fill-current' : ''}`} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Down</span>
                  </button>

                </div>
              </div>

            </article>

            {/* Comment replies lists block */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-[#d4e4fa] px-1">
                Comments ({activeDetailPost.comments.length})
              </h2>

              {/* Reply composition form */}
              <div className="glass-card rounded-xl p-4 border border-white/10 bg-[#122131]/40">
                <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Leave a comment anonymously..."
                    rows={3}
                    className="w-full bg-[#0d1c2d] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-[#c9c4d8]/40 focus:outline-none focus:border-[#cabeff] transition-all resize-none font-sans"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-[11px] text-[#c9c4d8]">
                      <Fingerprint className="w-3.5 h-3.5 text-[#cabeff]" />
                      <span>Incognito shadow reply</span>
                    </div>
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className={`px-5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${commentInput.trim()
                        ? 'bg-[#cabeff] text-[#32009a] hover:brightness-110 cursor-pointer'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                    >
                      Post
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Working Comment List replies */}
              <div className="space-y-3">
                {activeDetailPost.comments.length === 0 ? (
                  <p className="text-xs text-[#c9c4d8] text-center italic py-4">No comments written yet. Be the first to start the voice!</p>
                ) : (
                  activeDetailPost.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="glass-card rounded-xl p-4 border border-white/10 animate-fade-in"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${comment.avatarGradient} flex items-center justify-center flex-shrink-0 border border-white/10 shadow-sm text-[10px] uppercase text-white font-bold`}>
                          AN
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#cabeff]">Anonymous</span>
                            <span className="text-[10px] text-[#c9c4d8]/80 font-mono">
                              {comment.timestamp}
                            </span>
                          </div>

                          <p className="text-sm text-white leading-relaxed font-sans font-normal">
                            {comment.content}
                          </p>

                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center gap-1 text-xs transition-colors hover:text-[#cabeff] ${comment.userLiked ? 'text-[#cabeff]' : 'text-[#c9c4d8]'
                                }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-current' : ''}`} />
                              <span>{comment.likes}</span>
                            </button>
                            <span className="text-[10px] text-[#c9c4d8]/40">•</span>
                            <button
                              onClick={() => {
                                setCommentInput(`@Anonymous `);
                              }}
                              className="text-[10px] text-[#c9c4d8] hover:underline"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </section>

            {/* Post footer reports trigger */}
            <div className="flex justify-end pt-6">
              <button
                onClick={() => handleReportPost(activeDetailPost.id)}
                className="flex items-center gap-1.5 text-xs text-[#c9c4d8] hover:text-[#ffb4ab] transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Report this anonymous post
              </button>
            </div>

          </motion.div>
        )}

        {/* VIEW 4: MODERATION ADMIN PANEL */}
        {!isLoading && view === 'admin' && (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-20 px-4 max-w-7xl mx-auto"
          >
            <AdminPanel
              posts={posts}
              metrics={adminMetrics}
              users={adminUsers}
              isSuperAdmin={session?.isSuperAdmin || false}
              onKeep={handleAdminKeep}
              onDelete={handleAdminDelete}
              onCreateModerator={handleCreateModerator}
              onDeleteUser={handleDeleteUser}
              onNavigateDetail={(id) => {
                setSelectedPostId(id);
                setView('detail');
              }}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Compose Floating Trigger Button matches layout shapes spec */}
      {view === 'feed' && (
        <button
          onClick={() => {
            if (session) {
              setIsComposeOpen(true);
            } else {
              setView('auth');
            }
          }}
          className="bg-[#947dff] hover:bg-[#cabeff] hover:text-[#32009a] text-white p-4 rounded-full fixed bottom-20 right-6 shadow-2xl z-40 transition-all hover:scale-105 active:scale-95 border border-white/10 block sm:hidden cursor-pointer"
          title="Compose New anonymous confession"
          id="compose-float-trigger"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Dynamic Incognito Compose popup Modal dialog popup */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={handleAddConfession}
      />

      {/* Mobile viewports bottom persistent tabs bar */}
      {view !== 'auth' && view !== 'landing' && (
        <BottomBar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isAdmin={session?.isAdmin || false}
        />
      )}

    </div>
  );
}
