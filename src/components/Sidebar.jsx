import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTopics } from '../api/api';

export default function Sidebar() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getTopics();
        setTopics(res.data || []);
      } catch {
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { path: '/topics', label: 'Topics', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )},
    { path: '/ask', label: 'Ask Question', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Navigation */}
        <div className="glass-card p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-500' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Topics */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Trending Topics
          </h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-6 w-full" />
              ))}
            </div>
          ) : topics.length > 0 ? (
            <div className="space-y-1">
              {topics.slice(0, 8).map((topic) => (
                <Link
                  key={topic.id}
                  to={`/?tag=${encodeURIComponent(topic.name)}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600 transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/60" />
                  {topic.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No topics yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 text-xs text-slate-400 space-y-1">
          <p>© 2026 Wisora</p>
          <p>Knowledge Shared, Wisdom Gained</p>
        </div>
      </div>
    </aside>
  );
}
