import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, updateUserProfile, followUser } from '../api/api';
import { useUser } from '../context/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { userId } = useParams();
  const { currentUser, updateUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser && String(currentUser.id) === String(userId);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile(userId);
        setProfile(res.data);
        setEditData({
          username: res.data.username || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
        });
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateUserProfile(userId, editData);
      setProfile(res.data);
      if (isOwnProfile) updateUser(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    setFollowing(true);
    try {
      await followUser(currentUser.id, userId);
      setFollowed(true);
    } catch {
      // silent
    } finally {
      setFollowing(false);
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
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Profile card */}
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
        </div>

        <div className="px-6 sm:px-8 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-12 mb-4">
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
                  onClick={handleFollow}
                  disabled={following || followed}
                  className={`mt-14 ${followed ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {following ? 'Following...' : followed ? '✓ Following' : 'Follow'}
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
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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

      {/* Stats placeholder */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: 'Questions', value: '—', icon: '❓' },
          { label: 'Answers', value: '—', icon: '💬' },
          { label: 'Likes', value: '—', icon: '❤️' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
