import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, Image as ImageIcon, DollarSign, Calendar, 
  Code, Building, Tag, Layers, Monitor, Apple, 
  TerminalSquare, Save, ArrowLeft, Loader2
} from 'lucide-react';
import { createGame } from '../store/slices/gamesSlice';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const AddGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.games);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    headerImage: '',
    price: '',
    releaseDate: '',
    developer: '',
    publisher: '',
    genres: '',
    categories: '',
    platforms: {
      windows: true,
      mac: false,
      linux: false,
    },
    isFree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('platform_')) {
      const platform = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        platforms: { ...prev.platforms, [platform]: checked }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process comma-separated strings into arrays
    const payload = {
      ...formData,
      price: formData.isFree ? 0 : Number(formData.price),
      developer: formData.developer.split(',').map(s => s.trim()).filter(Boolean),
      publisher: formData.publisher.split(',').map(s => s.trim()).filter(Boolean),
      genres: formData.genres.split(',').map(s => s.trim()).filter(Boolean),
      categories: formData.categories.split(',').map(s => s.trim()).filter(Boolean),
    };

    const res = await dispatch(createGame(payload));
    if (!res.error) {
      navigate('/games'); // Redirect to games list on success
    }
  };

  const INPUT_CLASS = "w-full bg-white/[0.03] border border-white/[0.07] focus:border-[#3B82F6] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 transition-all placeholder:text-[#475569]";
  const LABEL_CLASS = "block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2";
  const CARD_CLASS  = "bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl shadow-2xl";

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors text-sm mb-3">
            <ArrowLeft className="w-4 h-4"/> Back
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-[#3B82F6]"/>
            Add New Game
          </h1>
          <p className="text-[#94A3B8] mt-2">Create a new game entry in the database catalog.</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className={CARD_CLASS}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-[#3B82F6]"/>
                </div>
                Basic Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className={LABEL_CLASS}>Game Title *</label>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className={INPUT_CLASS} placeholder="e.g. Cyberpunk 2077" />
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLASS}>Short Description</label>
                  <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="4" 
                    className="w-full bg-white/[0.03] border border-white/[0.07] focus:border-[#3B82F6] text-white text-sm rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 transition-all placeholder:text-[#475569] resize-none" 
                    placeholder="Brief summary of the game..." maxLength={500}></textarea>
                  <div className="text-right text-[10px] text-[#475569] mt-1">{formData.shortDescription.length}/500</div>
                </div>

                <div>
                  <label className={LABEL_CLASS}>Header Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="url" name="headerImage" value={formData.headerImage} onChange={handleChange} className={INPUT_CLASS} placeholder="https://cdn.akamai.steamstatic.com/..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className={CARD_CLASS}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#8B5CF6]"/>
                </div>
                Classification (Comma Separated)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={LABEL_CLASS}>Developer(s)</label>
                  <div className="relative">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="text" name="developer" value={formData.developer} onChange={handleChange} className={INPUT_CLASS} placeholder="CD Projekt Red" />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Publisher(s)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className={INPUT_CLASS} placeholder="CD Projekt" />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Genres</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="text" name="genres" value={formData.genres} onChange={handleChange} className={INPUT_CLASS} placeholder="Action, RPG, Sci-Fi" />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Categories</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="text" name="categories" value={formData.categories} onChange={handleChange} className={INPUT_CLASS} placeholder="Single-player, Achievements" />
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Sidebar Column */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            
            {/* Sales Info */}
            <div className={CARD_CLASS}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[#22C55E]"/>
                </div>
                Sales Info
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className={LABEL_CLASS}>Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} disabled={formData.isFree} className={`${INPUT_CLASS} ${formData.isFree ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="59.99" />
                  </div>
                </div>
                
                <label className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="w-4 h-4 text-[#3B82F6] rounded border-white/[0.1] bg-transparent focus:ring-[#3B82F6]/50" />
                  <span className="text-sm font-medium text-white">Free to Play</span>
                </label>

                <div>
                  <label className={LABEL_CLASS}>Release Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]"/>
                    <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className={`${INPUT_CLASS} [color-scheme:dark] pl-10`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className={CARD_CLASS}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-[#F59E0B]"/>
                </div>
                Platforms
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input type="checkbox" name="platform_windows" checked={formData.platforms.windows} onChange={handleChange} className="w-4 h-4 text-[#3B82F6] rounded border-white/[0.1] bg-transparent" />
                  <Monitor className="w-4 h-4 text-[#94A3B8]"/>
                  <span className="text-sm font-medium text-white">Windows</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input type="checkbox" name="platform_mac" checked={formData.platforms.mac} onChange={handleChange} className="w-4 h-4 text-[#3B82F6] rounded border-white/[0.1] bg-transparent" />
                  <Apple className="w-4 h-4 text-[#94A3B8]"/>
                  <span className="text-sm font-medium text-white">macOS</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input type="checkbox" name="platform_linux" checked={formData.platforms.linux} onChange={handleChange} className="w-4 h-4 text-[#3B82F6] rounded border-white/[0.1] bg-transparent" />
                  <TerminalSquare className="w-4 h-4 text-[#94A3B8]"/>
                  <span className="text-sm font-medium text-white">Linux</span>
                </label>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Action Bar (Sticky) */}
        <div className="fixed bottom-0 left-0 right-0 md:left-[72px] lg:left-[260px] p-4 bg-[#080f1c]/90 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-end z-20">
          <div className="flex gap-4 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-2.5 bg-[#3B82F6] hover:bg-blue-500 rounded-xl text-sm text-white font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
              {loading ? 'Saving...' : 'Save Game'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AddGame;
