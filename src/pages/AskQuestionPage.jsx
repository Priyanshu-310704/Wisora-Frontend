import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuestion, getTopics } from '../api/api';
import { useUser } from '../context/UserContext';

export default function AskQuestionPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/register');
      return;
    }
    const fetchTopics = async () => {
      try {
        const res = await getTopics();
        setTopics(res.data || []);
      } catch {
        // ok
      }
    };
    fetchTopics();
  }, [currentUser, navigate]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const t = tagInput.trim().replace(',', '');
      if (t && !tags.includes(t)) {
        setTags([...tags, t]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createQuestion(
        currentUser.id,
        title.trim(),
        body.trim(),
        tags.length > 0 ? tags : undefined
      );
      navigate(`/question/${res.data.id}`, { state: { question: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Ask a <span className="gradient-text">Question</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your curiosity with the community
        </p>
      </div>

      {/* Form */}
      <div className="glass-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className="input-glass text-lg font-medium"
              autoFocus
            />
            <p className="mt-1 text-xs text-slate-400">
              Be specific and imagine you're asking another person
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Details
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Include all the details someone would need to answer your question..."
              className="textarea-glass"
              rows={6}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Topic Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="tag-chip active group">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-white/70 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
              className="input-glass"
            />
            {/* Suggested tags from topics */}
            {topics.length > 0 && tags.length < 5 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {topics
                  .filter((t) => !tags.includes(t.name))
                  .slice(0, 6)
                  .map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setTags([...tags, topic.name])}
                      className="tag-chip text-xs"
                    >
                      + {topic.name}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm animate-slide-up">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                'Post Question'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
