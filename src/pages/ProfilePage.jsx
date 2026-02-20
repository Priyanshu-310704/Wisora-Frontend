import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile, toggleFollow, getUserQuestions } from '../api/api';
import { useUser } from '../context/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { userId } = useParams();
  const { currentUser, updateUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ username: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser && String(currentUser._id) === String(userId);

  const isFollowing = currentUser && profile?.followers?.some(
    (f) => String(f._id || f) === String(currentUser._id)
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, questionsRes] = await Promise.allSettled([
          getUserProfile(userId),
          getUserQuestions(userId),
        ]);

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data);
          setEditData({
            username: profileRes.value.data.username || '',
            bio: profileRes.value.data.bio || '',
          });
        }

        if (questionsRes.status === 'fulfilled') {
          setQuestions(questionsRes.value.data || []);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateUserProfile(userId, editData);
      setProfile((prev) => ({ ...prev, ...res.data }));
      if (isOwnProfile) updateUser(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      const res = await toggleFollow(userId);
      // Refresh profile to get updated followers list
      const updated = await getUserProfile(userId);
      setProfile(updated.data);
    } catch {
      // silent
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  if (!profile) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">User not found</h2>
        <p className="text-sm text-slate-400">This profile doesn't exist</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up space-y-4">
      {/* Profile card */}
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
        </div>

        <div className="px-6 sm:px-8 pb-6">
          {/* Avatar */}
          <div className="relative flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
              {profile.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {isOwnProfile ? (
              <button
                onClick={() => setEditing(!editing)}
                className="btn-secondary mt-14"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              currentUser && (
                <button
                  onClick={handleToggleFollow}
                  disabled={followLoading}
                  className={`mt-14 ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {followLoading ? '...' : isFollowing ? '✓ Following' : 'Follow'}
                </button>
              )
            )}
          </div>

          {editing ? (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="textarea-glass"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-6 py-2.5"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{profile.username}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{profile.email}</p>
              {profile.bio && (
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Questions', value: profile.questionsCount ?? 0, icon: '❓' },
          { label: 'Answers', value: profile.answersCount ?? 0, icon: '💬' },
          { label: 'Followers', value: profile.followers?.length ?? 0, icon: '👥' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* User's questions */}
      {questions.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-3">Recent Questions</h2>
          <div className="space-y-2">
            {questions.slice(0, 5).map((q) => (
              <Link
                key={q._id}
                to={`/question/${q._id}`}
                className="block px-3 py-2.5 rounded-lg hover:bg-indigo-50/80 transition-colors group"
              >
                <h3 className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(q.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
