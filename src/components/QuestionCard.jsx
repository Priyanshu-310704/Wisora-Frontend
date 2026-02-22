import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

export default function QuestionCard({ question, index = 0 }) {
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div
      className="glass-card p-5 sm:p-6 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Tags */}
      {question.topics && question.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {question.topics.map((tag) => (
            <Link
              key={tag._id || tag}
              to={`/?tag=${encodeURIComponent(typeof tag === 'string' ? tag : tag.name)}`}
              className="tag-chip"
            >
              {typeof tag === 'string' ? tag : tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <Link
        to={`/question/${question._id}`}
        className="block group"
      >
        <h2 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 leading-snug mb-2">
          {question.title}
        </h2>
      </Link>

      {/* Body preview */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
        {question.body}
      </p>

      {/* Image Preview */}
      {question.images && question.images.length > 0 && (
        <div className="mb-4">
          <div className="rounded-lg overflow-hidden border border-slate-100 max-h-48 w-full">
            <img 
              src={question.images[0]} 
              alt="Question" 
              className="w-full h-full object-cover"
            />
          </div>
          {question.images.length > 1 && (
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
              + {question.images.length - 1} more image{question.images.length > 2 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LikeButton targetId={question._id} targetType="Question" />
          <Link
            to={`/question/${question._id}`}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{question.answerCount ?? 0} Answers</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {question.user && (
            <Link
              to={`/profile/${question.user._id}`}
              className="text-xs text-slate-500 hover:text-indigo-600 transition-colors font-medium"
            >
              {question.user.username}
            </Link>
          )}
          <span className="text-xs text-slate-400">
            · {timeAgo(question.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
