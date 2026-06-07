import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { UserCircle, Camera, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { GlassCard, Button, Badge } from '../components';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@example.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer and gaming enthusiast. Managing the A-Steam platform.',
  });
  const [draft, setDraft] = useState(form);

  const handleSave = () => {
    setForm(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(form);
    setEditing(false);
  };

  const initials = form.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-primary-500" />
            Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information.</p>
        </div>
        {!editing ? (
          <Button
            id="edit-profile-btn"
            startIcon={<Edit3 className="w-4 h-4" />}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              id="save-profile-btn"
              startIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              id="cancel-edit-btn"
              variant="outlined"
              startIcon={<X className="w-4 h-4" />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl mx-auto">
                {initials}
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary-600 border-2 border-white dark:border-[#111111] flex items-center justify-center text-white shadow hover:bg-primary-700 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{form.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{form.email}</p>
            <Badge variant="primary" className="capitalize">
              {user?.role || 'Admin'}
            </Badge>

            <div className="mt-6 space-y-3 text-sm text-left">
              {[
                { icon: Mail, value: form.email },
                { icon: Phone, value: form.phone },
                { icon: MapPin, value: form.location },
                { icon: Calendar, value: `Joined ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Edit Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email Address', key: 'email', type: 'email' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Location', key: 'location', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <input
                    id={`profile-${key}`}
                    type={type}
                    value={editing ? draft[key] : form[key]}
                    disabled={!editing}
                    onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  rows={4}
                  value={editing ? draft.bio : form.bio}
                  disabled={!editing}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#27272a] text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all resize-none"
                />
              </div>
            </div>
          </GlassCard>

          {/* Activity Summary */}
          <GlassCard className="mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Activity Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Games Listed', value: '247' },
                { label: 'Reviews Moderated', value: '1,842' },
                { label: 'Users Managed', value: '6,034' },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-gray-50 dark:bg-[#111111]">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
