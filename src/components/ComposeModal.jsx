import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, X, Fingerprint, Send } from 'lucide-react';

export default function ComposeModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Relationship');
  const textareaRef = useRef(null);

  // Focus on opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      setContent('');
    }
  }, [isOpen]);

  const handlePost = () => {
    if (content.trim().length === 0) return;
    onSubmit(content.trim(), category);
    onClose();
  };

  const isNearingLimit = content.length > 450;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Glass Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#051424]/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="glass-card w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 border border-white/15"
          >
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#122131]/60">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#cabeff]" />
                <h2 className="font-semibold text-lg text-[#d4e4fa] tracking-tight">New Confession</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-[#c9c4d8] hover:text-[#d4e4fa] transition-colors p-1.5 rounded-full hover:bg-white/5 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Category Dropdown Selection */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#c9c4d8] uppercase tracking-wider mb-2">
                  Choose Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#273647]/50 border border-white/10 rounded-xl py-3 px-4 text-[#d4e4fa] appearance-none focus:outline-none focus:border-[#cabeff] focus:ring-1 focus:ring-[#cabeff] transition-all cursor-pointer"
                  >
                    <option value="Relationship">💔 Relationship</option>
                    <option value="School">📚 School</option>
                    <option value="Life">🌿 Life</option>
                    <option value="Campus">🏛️ Campus</option>
                    <option value="Other">💬 Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9c4d8]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Textarea Area */}
              <div className="flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={500}
                  rows={6}
                  placeholder="What's on your mind? It's completely anonymous."
                  className="w-full bg-[#122131]/20 border border-white/5 rounded-xl p-4 text-[#d4e4fa] placeholder-[#c9c4d8]/40 focus:outline-none focus:border-[#cabeff]/40 focus:ring-1 focus:ring-[#cabeff]/25 resize-none font-sans text-base leading-relaxed custom-scrollbar transition-all"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
              
              {/* Character limit progress status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#c9c4d8]">
                  <Fingerprint className="w-4 h-4 text-[#cabeff] animate-pulse" />
                  <span className="text-xs font-medium tracking-tight">Your identity is never shown publicly</span>
                </div>
                <span className={`text-xs font-mono tracking-wider ${
                  isNearingLimit ? 'text-[#ffb4ab]' : 'text-[#c9c4d8]'
                }`}>
                  {content.length} / 500
                </span>
              </div>

              {/* Action Operations */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-[#c9c4d8] hover:text-[#d4e4fa] hover:bg-white/5 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={content.trim().length === 0}
                  onClick={handlePost}
                  className={`px-6 py-2 rounded-full font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 ${
                    content.trim().length > 0
                      ? 'bg-[#947dff] text-white hover:brightness-115 shadow-xl shadow-[#947dff]/20 cursor-pointer'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Post
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
