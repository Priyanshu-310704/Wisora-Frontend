import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTopics } from '../api/api';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getTopics();
        setTopics((res.data || []).slice(0, 8));
      } catch {
        setTopics([]);
      }
    };
    fetchTopics();
  }, []);

  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-pink-500', 'bg-teal-500',
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-4">
      {/* Quick actions */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-1.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link
            to="/topics"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Topics
          </Link>
          {currentUser && (
            <Link
              to="/ask"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50/60 hover:bg-indigo-50 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ask Question
            </Link>
          )}
        </div>
      </div>

      {/* Popular topics */}
      {topics.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Popular Topics
          </h3>
          <div className="space-y-1">
            {topics.map((topic, i) => (
              <button
                key={topic._id}
                onClick={() => navigate(`/?tag=${encodeURIComponent(topic.name)}`)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600 transition-all duration-200 text-left"
              >
                <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                {topic.name}
              </button>
            ))}
          </div>
          <Link
            to="/topics"
            className="mt-3 block text-xs text-indigo-400 hover:text-indigo-600 font-medium transition-colors"
          >
            View all topics →
          </Link>
        </div>
      )}
    </aside>
  );
}
