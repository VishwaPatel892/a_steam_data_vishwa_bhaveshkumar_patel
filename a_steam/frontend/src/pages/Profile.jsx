import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Edit2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  MessageCircle, 
  User, 
  Code, 
  Globe,
  Clock,
  CheckCircle,
  Folder,
  Shield,
  Key,
  Smartphone
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// --- Dummy Data ---
const PROFILE_DATA = {
  name: 'Alexandria Smith',
  role: 'Senior Product Designer',
  email: 'alexandria.s@untitledui.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Product designer with a passion for creating intuitive and beautiful user experiences. Specializing in SaaS platforms and design systems.',
  avatar: 'https://i.pravatar.cc/250?img=47',
  banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
  skills: ['UI/UX Design', 'Figma', 'React', 'Design Systems', 'User Research', 'Prototyping'],
  socials: {
    twitter: '@alexandriadesigns',
    linkedin: 'in/alexandriasmith',
    github: 'alexandriasmith',
    website: 'alexandria.design'
  },
  projects: [
    { id: 1, name: 'Untitled UI Revamp', status: 'Completed', date: 'Mar 2024' },
    { id: 2, name: 'Analytics Dashboard', status: 'In Progress', date: 'Current' },
    { id: 3, name: 'Mobile App V2', status: 'Planning', date: 'Next Quarter' }
  ],
  activities: [
    { id: 1, action: 'Pushed code to', target: 'analytics-dashboard', time: '2 hours ago', icon: Folder },
    { id: 2, action: 'Completed task', target: 'Design System Update', time: '5 hours ago', icon: CheckCircle },
    { id: 3, action: 'Commented on', target: 'User Research Findings', time: 'Yesterday', icon: Mail }
  ]
};

const Profile = () => {
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Profile Header (Banner & Avatar) */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        {/* Banner */}
        <div className="h-48 md:h-64 w-full relative">
          <img 
            src={PROFILE_DATA.banner} 
            alt="Profile Banner" 
            className="w-full h-full object-cover"
          />
          <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 sm:px-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative -mt-16 sm:-mt-20">
          {/* Avatar */}
          <div className="relative group">
            <img 
              src={PROFILE_DATA.avatar} 
              alt={PROFILE_DATA.name} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md bg-white"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Name & Role */}
          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-24">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {PROFILE_DATA.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium flex items-center justify-center sm:justify-start gap-2">
              <Briefcase className="w-4 h-4" />
              {PROFILE_DATA.role}
            </p>
          </div>

          {/* Edit Button */}
          <div className="mt-4 sm:mt-24">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-xl shadow-sm transition-colors">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Info, Skills, Social) */}
        <motion.div variants={itemVariants} className="space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Personal Information</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
              {PROFILE_DATA.bio}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-400 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email</p>
                  <p>{PROFILE_DATA.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-400 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                  <p>{PROFILE_DATA.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-400 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Location</p>
                  <p>{PROFILE_DATA.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {PROFILE_DATA.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Social Profiles</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{PROFILE_DATA.socials.twitter}</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{PROFILE_DATA.socials.linkedin}</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Code className="w-5 h-5" />
                <span className="text-sm font-medium">{PROFILE_DATA.socials.github}</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{PROFILE_DATA.socials.website}</span>
              </a>
            </div>
          </div>

        </motion.div>

        {/* Right Column (Activity, Projects, Security) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          
          {/* Projects Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Projects</h3>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROFILE_DATA.projects.map((project) => (
                <div key={project.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group dark:hover:bg-gray-750/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                      <Folder className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                      project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                      project.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                      'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-3">{project.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4 space-y-8 pb-4">
              {PROFILE_DATA.activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-6">
                  <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500 flex items-center justify-center">
                    <activity.icon className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white mr-1">{PROFILE_DATA.name}</span>
                      {activity.action}
                      <span className="font-medium text-gray-900 dark:text-white ml-1">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-gray-900 dark:text-white" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security & Access</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security and authentication methods.</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Change Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-400" />
                    Password
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last changed 3 months ago.</p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
                  Change Password
                </button>
              </div>

              <hr className="border-gray-100 dark:border-gray-700/50" />

              {/* Two-Factor Auth */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    Two-factor authentication
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-sm font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
