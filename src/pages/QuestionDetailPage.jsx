import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { searchQuestions, postAnswer } from '../api/api';
import { useUser } from '../context/UserContext';
import LikeButton from '../components/LikeButton';
import AnswerCard from '../components/AnswerCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useUser();
  const [question, setQuestion] = useState(location.state?.question || null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(!question);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      if (question) {
        setLoading(false);
        return;
      }
      try {
        const res = await searchQuestions();
        const allQ = res.data || [];
        const found = allQ.find((q) => String(q.id) === String(id));
        if (found) setQuestion(found);
      } catch {
        // handled by empty state
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id, question]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !currentUser) return;
    setPosting(true);
    setError('');
    try {
      const res = await postAnswer(id, currentUser.id, newAnswer.trim());
      setAnswers((prev) => [...prev, res.data]);
      setNewAnswer('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading question..." />;

  if (!question) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Question not found</h2>
        <p className="text-sm text-slate-400 mb-4">This question may have been removed</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Question */}
      <div className="glass-card p-6 sm:p-8">
        {/* Tags */}
        {question.topics && question.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {question.topics.map((tag, i) => (
              <Link
                key={i}
                to={`/?tag=${encodeURIComponent(typeof tag === 'string' ? tag : tag)}`}
                className="tag-chip"
              >
                {typeof tag === 'string' ? tag : tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-4">
          {question.title}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
          {question.body}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <LikeButton type="questions" id={question.id} />
          <span className="text-xs text-slate-400">
            {question.created_at
              ? new Date(question.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : ''}
          </span>
        </div>
      </div>

      {/* Answers header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-700">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
      </div>

      {/* Answers list */}
      {answers.length > 0 ? (
        <div className="space-y-4">
          {answers.map((a) => (
            <AnswerCard
              key={a.id}
              answer={a}
              onUpdate={(updated) =>
                setAnswers((prev) =>
                  prev.map((ans) => (ans.id === updated.id ? updated : ans))
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-slate-400">No answers yet. Share your knowledge!</p>
        </div>
      )}

      {/* Post answer */}
      {currentUser ? (
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-slate-700 mb-3">Your Answer</h3>
          <form onSubmit={handlePostAnswer} className="space-y-4">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="textarea-glass"
              rows={4}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={posting || !newAnswer.trim()}
              className="btn-primary px-6 py-2.5"
            >
              {posting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                'Post Answer'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-slate-500">
            <Link to="/register" className="text-indigo-500 font-medium hover:underline">
              Join Wisora
            </Link>{' '}
            to answer this question
          </p>
        </div>
      )}
    </div>
  );
}
