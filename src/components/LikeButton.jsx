import { useState } from 'react';
import { likeEntity } from '../api/api';
import { useUser } from '../context/UserContext';

export default function LikeButton({ type, id, initialCount = 0 }) {
  const { currentUser } = useUser();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);

  const handleLike = async () => {
    if (!currentUser) return;
    setAnimating(true);
    try {
      await likeEntity(type, id, currentUser.id);
      setLiked(!liked);
      setCount((c) => (liked ? c - 1 : c + 1));
    } catch {
      // still toggle for UX optimism
      setLiked(!liked);
      setCount((c) => (liked ? c - 1 : c + 1));
    }
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleLike}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
        liked
          ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-rose-500 border border-rose-200'
          : 'bg-white/50 text-slate-400 border border-slate-200 hover:text-rose-400 hover:border-rose-200 hover:bg-rose-50/50'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-4.5 h-4.5 transition-all duration-300 ${
          animating ? 'animate-pulse-heart' : ''
        } ${liked ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{count}</span>
    </button>
  );
}
