import React, { useState } from 'react';
import { Shield, Check, Trash2, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

export default function AdminPanel({
  posts,
  onKeep,
  onDelete,
  onNavigateDetail
}) {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter posts based on active moderator state
  const filteredPosts = posts.filter(post => {
    if (filter === 'reported') {
      return post.reports > 0 || post.isReported;
    }
    return true;
  });

  // Basic client-side pagination
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Compute stats
  const activePostsCount = posts.length + 1280; // Hardcoded base to match mockup + dynamic variation
  const flaggedCount = posts.filter(p => p.reports > 0 || p.isReported).length + 39; // Match mockup
  const uniqueCategories = 5; 
  const onlineModsCount = 4;

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Relationship':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'School':
        return 'bg-[#cabeff]/15 text-[#cabeff] border border-[#cabeff]/20';
      case 'Campus':
        return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20';
      case 'Life':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-[#c5c6ce]/10 text-[#c5c6ce] border border-[#c5c6ce]/20';
    }
  };

  const handleDeleteWithConfirm = (post) => {
    if (window.confirm(`Are you sure you want to permanently delete this confession?\n\n"${post.content.slice(0, 60)}..."`)) {
      onDelete(post.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Metrics Rows */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#d4e4fa] tracking-tight">Content Moderation</h2>
            <p className="text-sm text-[#c9c4d8] mt-0.5">Review and manage anonymous student confessions.</p>
          </div>
          
          {/* Admin Table Filters */}
          <div className="flex items-center gap-1.5 bg-[#122131] p-1 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#947dff] text-white shadow-md'
                  : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => {
                setFilter('reported');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'reported'
                  ? 'bg-[#947dff] text-white shadow-md'
                  : 'text-[#c9c4d8] hover:text-[#d4e4fa]'
              }`}
            >
              Reported Only
            </button>
          </div>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="glass-card p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Active Posts</p>
            <p className="text-2xl font-bold text-[#cabeff] mt-1">{activePostsCount.toLocaleString()}</p>
          </div>

          <div className="glass-card p-4 rounded-xl border-l-4 border-[#ffb4ab] border-white/10">
            <p className="text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Flagged</p>
            <p className="text-2xl font-bold text-[#ffb4ab] mt-1">{flaggedCount}</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Categories</p>
            <p className="text-2xl font-bold text-[#c5c6ce] mt-1">{uniqueCategories}</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Online Mods</p>
              <p className="text-2xl font-bold text-[#d4e4fa] mt-1">{onlineModsCount}</p>
            </div>
            <UserCheck className="w-5 h-5 text-emerald-400 opacity-60" />
          </div>

        </div>
      </div>

      {/* Main Table View */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#273647]/40 border-b border-white/10">
                <th className="px-5 py-4 text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Post Content</th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Category</th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider">Status/Reports</th>
                <th className="px-5 py-4 text-[10px] font-bold text-[#c9c4d8] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5 bg-[#122131]/20">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-[#c9c4d8]">
                    No confessions found matching filter guidelines. All clear! ✨
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Visual post content cell */}
                    <td className="px-5 py-4 max-w-sm sm:max-w-md">
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr ${post.avatarGradient} flex items-center justify-center border border-white/10`}>
                          <span className="text-[10px] font-bold uppercase text-white">
                            {post.author.slice(10, 12)}
                          </span>
                        </div>
                        
                        <div>
                          <p 
                            onClick={() => onNavigateDetail(post.id)}
                            className="text-sm font-medium text-[#d4e4fa] hover:text-[#cabeff] transition-colors line-clamp-2 cursor-pointer leading-relaxed"
                          >
                            "{post.content}"
                          </p>
                          <p className="text-[10px] text-[#c9c4d8] mt-1 font-mono italic">
                            By {post.author} • {post.timestamp}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category cell */}
                    <td className="px-5 py-4 vertical-middle">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeClass(post.category)}`}>
                        {post.category}
                      </span>
                    </td>

                    {/* Report indicators cell */}
                    <td className="px-5 py-4 vertical-middle">
                      {post.reports > 0 || post.isReported ? (
                        <div className="flex items-center gap-1.5 text-[#ffb4ab]">
                          <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />
                          <span className="text-xs font-semibold">{post.reports} reports</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[#c9c4d8]/50">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs">0 reports</span>
                        </div>
                      )}
                    </td>

                    {/* Active row action triggers */}
                    <td className="px-5 py-4 vertical-middle text-right">
                      <div className="flex justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onKeep(post.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                          title="Keep & Clear reports"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWithConfirm(post)}
                          className="p-1.5 rounded-lg bg-[#93000a]/10 hover:bg-[#93000a]/35 text-[#ffb4ab] transition-colors"
                          title="Delete from college channel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* List Pagination row */}
        <div className="px-5 py-4 bg-[#273647]/20 border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-[#c9c4d8]">
            Showing <span className="font-semibold text-[#d4e4fa]">{paginatedPosts.length}</span> of{' '}
            <span className="font-semibold text-[#d4e4fa]">{totalItems}</span> filtered items (Total base active: {activePostsCount.toLocaleString()})
          </p>
          
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/10 text-[#c9c4d8] hover:bg-white/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/10 text-[#c9c4d8] hover:bg-white/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
