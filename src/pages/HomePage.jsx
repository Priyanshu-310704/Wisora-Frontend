import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchQuestions, getQuestions, getTopics } from '../api/api';
import QuestionCard from '../components/QuestionCard';
import TopicFilter from '../components/TopicFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useUser } from '../context/UserContext';

export default function HomePage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [activeTopic, setActiveTopic] = useState(searchParams.get('tag') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const searchVal = searchParams.get('search') || '';
        const tagVal = searchParams.get('tag') || '';

        const [qRes, tRes] = await Promise.allSettled([
          searchVal || tagVal
            ? searchQuestions(searchVal, tagVal)
            : getQuestions(1),
          getTopics(),
        ]);

        if (qRes.status === 'fulfilled') {
          const data = qRes.value.data;
          // getQuestions returns { questions, page, total }, searchQuestions returns array
          setQuestions(Array.isArray(data) ? data : data.questions || []);
        } else {
          setQuestions([]);
        }

        setTopics(tRes.status === 'fulfilled' ? tRes.value.data || [] : []);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText.trim()) params.set('search', searchText.trim());
    if (activeTopic) params.set('tag', activeTopic);
    navigate(`/?${params.toString()}`);
  };

  const handleTopicSelect = (topicName) => {
    setActiveTopic(topicName);
    const params = new URLSearchParams();
    if (searchText.trim()) params.set('search', searchText.trim());
    if (topicName) params.set('tag', topicName);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Hero search */}
      <div className="glass-card p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
          Explore <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-sm text-slate-500 mb-5">
          Discover, learn, and share knowledge with the community
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search questions by text..."
              className="input-glass pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Search
          </button>
        </form>

        {topics.length > 0 && (
          <div className="mt-4">
            <TopicFilter
              topics={topics}
              activeTopic={activeTopic}
              onSelect={handleTopicSelect}
            />
          </div>
        )}
      </div>

      {/* Questions list */}
      {loading ? (
        <LoadingSpinner text="Finding great questions..." />
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard key={q._id} question={q} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No questions found"
          description={
            searchText || activeTopic
              ? 'Try adjusting your search or filters'
              : 'Be the first to ask a question!'
          }
          action={currentUser ? () => navigate('/ask') : null}
          actionLabel="Ask a Question"
        />
      )}
    </div>
  );
}
