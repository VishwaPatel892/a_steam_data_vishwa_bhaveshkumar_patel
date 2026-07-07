import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, DollarSign, Gamepad2, MessageSquare, Crown, Server,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Download, Plus, MoreHorizontal, Search, Bell, Settings,
  Star, Heart, Trash2, CheckCircle, XCircle, Clock, Zap,
  Shield, Database, Cpu, HardDrive, Wifi, Activity,
  UserPlus, BookOpen, Megaphone, Tag, BarChart3, FileText,
  RefreshCw, ChevronRight, ChevronLeft, Eye, Send,
  Play, Calendar, Globe, Layers, AlertTriangle, Trophy,
  Target, Filter, SortAsc, ThumbsUp, MessageCircle,
  CreditCard, Banknote, Repeat, Lock, MonitorDot,
  Rocket, Flame, Package
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { useSelector } from 'react-redux';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const REVENUE_DATA = {
  week:  [
    { t: 'Mon', revenue: 12400, expenses: 4200, profit: 8200, subs: 340 },
    { t: 'Tue', revenue: 18200, expenses: 5100, profit: 13100, subs: 420 },
    { t: 'Wed', revenue: 15600, expenses: 4800, profit: 10800, subs: 380 },
    { t: 'Thu', revenue: 22100, expenses: 6200, profit: 15900, subs: 510 },
    { t: 'Fri', revenue: 28400, expenses: 7100, profit: 21300, subs: 630 },
    { t: 'Sat', revenue: 34200, expenses: 8400, profit: 25800, subs: 720 },
    { t: 'Sun', revenue: 29800, expenses: 7200, profit: 22600, subs: 680 },
  ],
  month: [
    { t: 'W1', revenue: 88000, expenses: 24000, profit: 64000, subs: 2100 },
    { t: 'W2', revenue: 105000, expenses: 28000, profit: 77000, subs: 2600 },
    { t: 'W3', revenue: 98000, expenses: 26000, profit: 72000, subs: 2400 },
    { t: 'W4', revenue: 127000, expenses: 32000, profit: 95000, subs: 3100 },
  ],
  year: [
    { t: 'Jan', revenue: 320000, expenses: 88000, profit: 232000, subs: 8200 },
    { t: 'Feb', revenue: 298000, expenses: 82000, profit: 216000, subs: 7800 },
    { t: 'Mar', revenue: 415000, expenses: 105000, profit: 310000, subs: 10200 },
    { t: 'Apr', revenue: 388000, expenses: 98000, profit: 290000, subs: 9600 },
    { t: 'May', revenue: 462000, expenses: 118000, profit: 344000, subs: 11400 },
    { t: 'Jun', revenue: 510000, expenses: 132000, profit: 378000, subs: 12800 },
    { t: 'Jul', revenue: 487000, expenses: 125000, profit: 362000, subs: 12100 },
    { t: 'Aug', revenue: 534000, expenses: 138000, profit: 396000, subs: 13400 },
    { t: 'Sep', revenue: 568000, expenses: 145000, profit: 423000, subs: 14200 },
    { t: 'Oct', revenue: 612000, expenses: 158000, profit: 454000, subs: 15300 },
    { t: 'Nov', revenue: 655000, expenses: 168000, profit: 487000, subs: 16400 },
    { t: 'Dec', revenue: 724000, expenses: 185000, profit: 539000, subs: 18100 },
  ],
};

const SPARK = [4,9,6,14,10,18,13,22,17,28];

const USER_GROWTH = [
  { m: 'Jan', users: 8200, new: 1200 }, { m: 'Feb', users: 9400, new: 1400 },
  { m: 'Mar', users: 11200, new: 1800 }, { m: 'Apr', users: 12800, new: 1600 },
  { m: 'May', users: 15100, new: 2300 }, { m: 'Jun', users: 17400, new: 2100 },
];

const PLATFORM_DATA = [
  { name: 'PC / Windows', value: 52, color: '#3B82F6' },
  { name: 'Console', value: 28, color: '#8B5CF6' },
  { name: 'Mobile', value: 14, color: '#22C55E' },
  { name: 'Mac / Linux', value: 6, color: '#F59E0B' },
];

const SENTIMENT_DATA = [
  { name: 'Positive', value: 64, color: '#22C55E' },
  { name: 'Neutral',  value: 21, color: '#F59E0B' },
  { name: 'Negative', value: 15, color: '#EF4444' },
];

const FORECAST_DATA = [
  { m: 'Aug', actual: 534000, forecast: 534000 },
  { m: 'Sep', actual: 568000, forecast: 562000 },
  { m: 'Oct', actual: 612000, forecast: 598000 },
  { m: 'Nov', actual: 655000, forecast: 641000 },
  { m: 'Dec', actual: null,   forecast: 710000 },
  { m: 'Jan', actual: null,   forecast: 758000 },
];

const TOP_GAMES = [
  { id:1, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', name:'Elden Ring',       category:'RPG',     downloads:'4.2M', revenue:'$89.4M', rating:4.9, status:'Published',   release:'Feb 2022' },
  { id:2, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', name:'Cyberpunk 2077',  category:'Action',  downloads:'3.8M', revenue:'$76.2M', rating:4.6, status:'Published',   release:'Dec 2020' },
  { id:3, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1382330/header.jpg', name:'Forza Horizon 5', category:'Racing',  downloads:'3.1M', revenue:'$54.7M', rating:4.8, status:'Published',   release:'Nov 2021' },
  { id:4, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg', name:'Starfield',       category:'RPG',     downloads:'2.7M', revenue:'$48.9M', rating:4.2, status:'Published',   release:'Sep 2023' },
  { id:5, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2183900/header.jpg', name:'Hollow Knight 2', category:'Indie',   downloads:'1.2M', revenue:'$18.4M', rating:4.9, status:'Coming Soon', release:'TBA 2025' },
  { id:6, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', name:'Baldur\'s Gate 3', category:'RPG',    downloads:'3.4M', revenue:'$68.1M', rating:5.0, status:'Published',   release:'Aug 2023' },
  { id:7, cover:'https://cdn.akamai.steamstatic.com/steam/apps/1659040/header.jpg', name:'Dave the Diver',  category:'Indie',   downloads:'0.9M', revenue:'$12.8M', rating:4.7, status:'Published',   release:'Jun 2023' },
  { id:8, cover:'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg', name:'Redfall',         category:'Action',  downloads:'0.6M', revenue:'$8.2M',  rating:3.1, status:'Archived',    release:'May 2023' },
];

const ACTIVITIES = [
  { icon: UserPlus,     color:'#3B82F6', label:'New user registered',   detail:'vpatel6683@gmail.com',        time:'2m ago' },
  { icon: Gamepad2,     color:'#8B5CF6', label:'Game published',         detail:'Hollow Knight: Silksong',     time:'8m ago' },
  { icon: MessageSquare,color:'#22C55E', label:'Review submitted',       detail:'Elden Ring — ⭐ 5/5',         time:'14m ago' },
  { icon: DollarSign,   color:'#F59E0B', label:'Payment received',       detail:'$89.99 — Premium Bundle',     time:'21m ago' },
  { icon: Shield,       color:'#EF4444', label:'Mod action taken',       detail:'User banned: spam violation', time:'35m ago' },
  { icon: Crown,        color:'#F59E0B', label:'Subscription upgraded',  detail:'Free → Premium',              time:'1h ago' },
  { icon: Gamepad2,     color:'#8B5CF6', label:'Beta access granted',    detail:'Starfield DLC preview',       time:'2h ago' },
  { icon: UserPlus,     color:'#3B82F6', label:'New user registered',    detail:'alex.m@proton.me',            time:'2h ago' },
];

const REVIEWS = [
  { id:1, user:'Alex Mitchell',   avatar:'A', rating:5, game:'Elden Ring',        text:'Absolutely breathtaking. FromSoftware has outdone themselves with the open world design.', time:'2h ago',   likes:142, approved:true },
  { id:2, user:'Sarah Chen',      avatar:'S', rating:4, game:'Cyberpunk 2077',    text:'After all the patches it\'s finally a great game. Night City feels incredibly alive now.',   time:'5h ago',   likes:98,  approved:true },
  { id:3, user:'Marcus Reed',     avatar:'M', rating:2, game:'Redfall',           text:'Disappointing launch. The game feels unfinished and the co-op is broken.',                    time:'1d ago',   likes:67,  approved:false },
  { id:4, user:'Priya Kapoor',    avatar:'P', rating:5, game:'Baldur\'s Gate 3',  text:'A masterpiece. Larian has set a new standard for RPGs. 200+ hours and still discovering.',  time:'1d ago',   likes:234, approved:true },
];

const TRANSACTIONS = [
  { id:'INV-4821', customer:'Alex Mitchell',  method:'Visa •••• 4821',   amount:89.99,  status:'Success',  date:'Jul 7, 2026' },
  { id:'INV-4820', customer:'Sarah Chen',     method:'PayPal',            amount:14.99,  status:'Success',  date:'Jul 7, 2026' },
  { id:'INV-4819', customer:'Marcus Reed',    method:'Mastercard •••• 7713', amount:59.99, status:'Pending', date:'Jul 6, 2026' },
  { id:'INV-4818', customer:'Priya Kapoor',   method:'Crypto (ETH)',      amount:124.00, status:'Success',  date:'Jul 6, 2026' },
  { id:'INV-4817', customer:'James Wilson',   method:'Visa •••• 2209',   amount:89.99,  status:'Refunded', date:'Jul 5, 2026' },
  { id:'INV-4816', customer:'Emma Larson',    method:'Amex •••• 5501',   amount:44.99,  status:'Failed',   date:'Jul 5, 2026' },
];

const UPCOMING = [
  { cover:'https://cdn.akamai.steamstatic.com/steam/apps/2183900/header.jpg', name:'Hollow Knight: Silksong', platform:'PC / Switch', release:'Q3 2025', revenue:'$28M', preorders:142000, countdown:'89d' },
  { cover:'https://cdn.akamai.steamstatic.com/steam/apps/2358720/header.jpg', name:'GTA VI',                  platform:'PS5 / XSX',  release:'Fall 2025',revenue:'$2.1B',preorders:4820000,countdown:'180d'},
  { cover:'https://cdn.akamai.steamstatic.com/steam/apps/1282100/header.jpg', name:'Stalker 2',               platform:'PC / XSX',   release:'Sep 2025', revenue:'$42M', preorders:380000, countdown:'62d' },
];

const QUICK_ACTIONS = [
  { icon: Plus,        label:'Add Game',        color:'from-blue-600 to-blue-500',    glow:'rgba(59,130,246,0.3)' },
  { icon: Users,       label:'Manage Users',    color:'from-violet-600 to-purple-500',glow:'rgba(139,92,246,0.3)' },
  { icon: Megaphone,   label:'Publish Update',  color:'from-emerald-600 to-green-500',glow:'rgba(34,197,94,0.3)' },
  { icon: Shield,      label:'Moderate',        color:'from-rose-600 to-red-500',     glow:'rgba(239,68,68,0.3)' },
  { icon: BarChart3,   label:'Reports',         color:'from-amber-600 to-yellow-500', glow:'rgba(245,158,11,0.3)' },
  { icon: Tag,         label:'Discount',        color:'from-pink-600 to-rose-500',    glow:'rgba(236,72,153,0.3)' },
  { icon: Database,    label:'Backup DB',       color:'from-cyan-600 to-sky-500',     glow:'rgba(6,182,212,0.3)'  },
  { icon: Settings,    label:'System',          color:'from-slate-600 to-gray-500',   glow:'rgba(100,116,139,0.3)'},
];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const CARD = 'bg-[#0d1b2e]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl';
const SECTION_TITLE = 'text-lg font-bold text-white tracking-tight';
const SUB_TEXT = 'text-sm text-[#94A3B8]';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{type:'spring',stiffness:260,damping:22}} };
const stagger = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.08}} };

// ─────────────────────────────────────────────────────────────────────────────
// TINY SPARKLINE
// ─────────────────────────────────────────────────────────────────────────────

const Spark = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <AreaChart data={data.map((v,i)=>({v,i}))} margin={{top:2,right:0,left:0,bottom:0}}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.3}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sg-${color})`} dot={false} isAnimationActive={true}/>
    </AreaChart>
  </ResponsiveContainer>
);

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────────────────────

const useCounter = (target, duration = 1200) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.floor(start));
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — STAT CARDS
// ─────────────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { icon:Users,        title:'Total Users',         raw:124563, display:'124.5K', prefix:'',  growth:12.5, positive:true,  color:'#3B82F6', spark:SPARK },
  { icon:DollarSign,   title:'Monthly Revenue',     raw:45231,  display:'$45.2K', prefix:'$', growth:8.2,  positive:true,  color:'#8B5CF6', spark:[6,10,8,16,12,20,14,24,18,30] },
  { icon:Gamepad2,     title:'Active Games',        raw:1204,   display:'1,204',  prefix:'',  growth:2.4,  positive:false, color:'#22C55E', spark:[18,14,20,16,22,18,24,20,26,22] },
  { icon:MessageSquare,title:'New Reviews',         raw:892,    display:'892',    prefix:'',  growth:18.7, positive:true,  color:'#F59E0B', spark:[8,12,9,16,11,18,13,20,15,22] },
  { icon:Crown,        title:'Premium Subscribers', raw:3841,   display:'3,841',  prefix:'',  growth:24.3, positive:true,  color:'#EC4899', spark:[4,8,6,12,9,16,11,18,13,20] },
  { icon:Server,       title:'Server Uptime',       raw:99,     display:'99.97%', prefix:'',  growth:0.02, positive:true,  color:'#06B6D4', spark:[98,99,98,100,99,100,99,100,99,100] },
];

const StatCard = ({ card, index }) => {
  const Icon = card.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y:-5, boxShadow:`0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${card.color}18` }}
      className={`${CARD} p-5 cursor-default relative overflow-hidden flex flex-col`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{background:`radial-gradient(circle at 80% 20%, ${card.color}, transparent 60%)`}}/>

      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`${card.color}18`,border:`1px solid ${card.color}30`}}>
          <Icon className="w-5 h-5" style={{color:card.color}}/>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${card.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {card.positive ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
          {card.growth}%
        </div>
      </div>

      <span className="text-[#94A3B8] text-sm font-medium mb-1 line-clamp-1">{card.title}</span>

      <div className="text-2xl xl:text-3xl font-black text-white tracking-tight mb-1">
        {card.display}
      </div>
      <div className="text-xs text-[#94A3B8] mb-3">
        vs. last month
      </div>

      <div className="h-10 -mx-1 mt-auto">
        <Spark data={card.spark} color={card.color}/>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — REVENUE CHART
// ─────────────────────────────────────────────────────────────────────────────

const CHART_FILTERS = ['Today','Week','Month','Year'];
const CHART_METRICS = ['Revenue','Expenses','Profit','Subscriptions'];
const METRIC_KEYS = { Revenue:'revenue', Expenses:'expenses', Profit:'profit', Subscriptions:'subs' };
const METRIC_COLORS = { Revenue:'#3B82F6', Expenses:'#EF4444', Profit:'#22C55E', Subscriptions:'#8B5CF6' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 shadow-2xl text-xs min-w-[140px]">
      <p className="text-[#94A3B8] mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
            <span className="text-[#94A3B8] capitalize">{p.name}</span>
          </div>
          <span className="text-white font-bold">
            {typeof p.value === 'number' && p.value > 999 ? `$${(p.value/1000).toFixed(0)}k` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const RevenueSection = () => {
  const [period, setPeriod] = useState('Year');
  const [metrics, setMetrics] = useState(['Revenue','Profit']);
  const data = REVENUE_DATA[period.toLowerCase()] ?? REVENUE_DATA.year;

  const toggle = m => setMetrics(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev, m]);

  return (
    <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-3 gap-5">

      {/* Chart panel */}
      <div className={`${CARD} p-5 xl:col-span-2`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className={SECTION_TITLE}>Revenue Analytics</h2>
            <p className={`${SUB_TEXT} mt-0.5`}>Financial performance overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/[0.04] rounded-xl p-1 gap-1">
              {CHART_FILTERS.map(f => (
                <button key={f} onClick={()=>setPeriod(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period===f ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-[#94A3B8] hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button className="p-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-[#94A3B8] hover:text-white transition-colors">
              <Download className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Metric toggles */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CHART_METRICS.map(m => (
            <button key={m} onClick={()=>toggle(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${metrics.includes(m) ? 'border-transparent' : 'border-white/10 text-[#94A3B8]'}`}
              style={metrics.includes(m) ? {background:`${METRIC_COLORS[m]}20`,color:METRIC_COLORS[m],borderColor:`${METRIC_COLORS[m]}40`} : {}}>
              <div className="w-2 h-2 rounded-full" style={{background:metrics.includes(m)?METRIC_COLORS[m]:'#475569'}}/>
              {m}
            </button>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{top:4,right:4,left:-10,bottom:0}}>
              <defs>
                {CHART_METRICS.map(m => (
                  <linearGradient key={m} id={`rev-${m}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={METRIC_COLORS[m]} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={METRIC_COLORS[m]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{fill:'#475569',fontSize:11}} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'#475569',fontSize:11}} dx={-4} tickFormatter={v => v>=1000?`$${v/1000}k`:v}/>
              <Tooltip content={<CustomTooltip/>}/>
              {CHART_METRICS.filter(m=>metrics.includes(m)).map(m => (
                <Area key={m} type="monotone" dataKey={METRIC_KEYS[m]} name={m}
                  stroke={METRIC_COLORS[m]} strokeWidth={2.5}
                  fill={`url(#rev-${m})`} dot={false} activeDot={{r:5,fill:METRIC_COLORS[m],strokeWidth:0}}/>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className={`${CARD} p-5 flex flex-col`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={SECTION_TITLE}>Live Activity</h2>
            <p className={`${SUB_TEXT} mt-0.5`}>Real-time platform events</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"/>
            LIVE
          </div>
        </div>

        <div className="flex-1 space-y-0 overflow-y-auto scrollbar-hide">
          {ACTIVITIES.map((a, i) => (
            <motion.div key={i} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
              className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] rounded-lg px-1 transition-colors">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{background:`${a.color}18`,border:`1px solid ${a.color}30`}}>
                <a.icon className="w-4 h-4" style={{color:a.color}}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{a.label}</p>
                <p className="text-[#94A3B8] text-xs truncate">{a.detail}</p>
              </div>
              <span className="text-[10px] text-[#475569] whitespace-nowrap mt-1">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — TOP GAMES TABLE
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Published:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Draft:        'bg-slate-500/15   text-slate-400   border border-slate-500/30',
  'Coming Soon':'bg-blue-500/15    text-blue-400    border border-blue-500/30',
  Archived:     'bg-rose-500/15    text-rose-400    border border-rose-500/30',
};

const Stars = ({ n }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={`w-3.5 h-3.5 ${s<=Math.round(n)?'text-amber-400 fill-amber-400':'text-slate-700'}`}/>
    ))}
    <span className="text-[#94A3B8] text-xs ml-1">{n.toFixed(1)}</span>
  </div>
);

const TopGamesTable = () => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('rating');
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  const filtered = TOP_GAMES.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  const sorted   = [...filtered].sort((a,b) => sortKey==='rating' ? b.rating-a.rating : a.name.localeCompare(b.name));
  const paginated = sorted.slice(page*PER_PAGE, (page+1)*PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  return (
    <motion.div variants={fadeUp} className={`${CARD} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-white/[0.06]">
        <div>
          <h2 className={SECTION_TITLE}>Top Performing Games</h2>
          <p className={`${SUB_TEXT} mt-0.5`}>{filtered.length} games · sorted by {sortKey}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#475569]"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search games…"
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#3B82F6]/60 w-48"/>
          </div>
          <button onClick={()=>setSortKey(s=>s==='rating'?'name':'rating')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl text-xs text-[#94A3B8] hover:text-white transition-colors">
            <SortAsc className="w-3.5 h-3.5"/> Sort
          </button>
          <button className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl text-xs text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5"/> Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Game','Category','Downloads','Revenue','Rating','Status','Release',''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((g, i) => (
              <motion.tr key={g.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
                className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={g.cover} alt={g.name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/>
                    </div>
                    <span className="font-semibold text-white group-hover:text-[#3B82F6] transition-colors">{g.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#94A3B8]">{g.category}</td>
                <td className="px-5 py-3 text-white font-medium">{g.downloads}</td>
                <td className="px-5 py-3 text-white font-bold">{g.revenue}</td>
                <td className="px-5 py-3"><Stars n={g.rating}/></td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[g.status]||STATUS_STYLES.Draft}`}>{g.status}</span>
                </td>
                <td className="px-5 py-3 text-[#94A3B8] text-xs">{g.release}</td>
                <td className="px-5 py-3">
                  <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/[0.08] rounded-lg text-[#94A3B8] hover:text-white transition-all">
                    <MoreHorizontal className="w-4 h-4"/>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
        <span className="text-xs text-[#475569]">Page {page+1} of {totalPages}</span>
        <div className="flex items-center gap-1">
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
            className="p-1.5 rounded-lg border border-white/[0.07] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          {Array.from({length:totalPages},(_,i)=>i).map(i => (
            <button key={i} onClick={()=>setPage(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${i===page?'bg-[#3B82F6] text-white':'text-[#94A3B8] hover:bg-white/[0.06] hover:text-white'}`}>
              {i+1}
            </button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1}
            className="p-1.5 rounded-lg border border-white/[0.07] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — ANALYTICS GRID
// ─────────────────────────────────────────────────────────────────────────────

const PieLabel = ({ cx,cy,midAngle,outerRadius,percent,name }) => {
  const RADIAN = Math.PI/180;
  const r = outerRadius+24;
  const x = cx + r*Math.cos(-midAngle*RADIAN);
  const y = cy + r*Math.sin(-midAngle*RADIAN);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="#94A3B8" textAnchor={x>cx?'start':'end'} fontSize={10} fontFamily="Inter">
      {`${(percent*100).toFixed(0)}%`}
    </text>
  );
};

const AnalyticsGrid = () => (
  <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

    {/* User Growth */}
    <div className={`${CARD} p-5`}>
      <h3 className="text-sm font-bold text-white mb-1">User Growth</h3>
      <p className={`${SUB_TEXT} text-xs mb-4`}>Monthly active users</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={USER_GROWTH} margin={{top:0,right:0,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill:'#475569',fontSize:10}}/>
            <YAxis axisLine={false} tickLine={false} tick={{fill:'#475569',fontSize:10}} tickFormatter={v=>`${v/1000}k`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="users" fill="#3B82F6" radius={[4,4,0,0]} maxBarSize={28}/>
            <Bar dataKey="new"   fill="#8B5CF6" radius={[4,4,0,0]} maxBarSize={28}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-2">
        <div className="flex items-center gap-1 text-xs text-[#94A3B8]"><div className="w-2 h-2 rounded bg-[#3B82F6]"/> Total</div>
        <div className="flex items-center gap-1 text-xs text-[#94A3B8]"><div className="w-2 h-2 rounded bg-[#8B5CF6]"/> New</div>
      </div>
    </div>

    {/* Platform Donut */}
    <div className={`${CARD} p-5`}>
      <h3 className="text-sm font-bold text-white mb-1">Platform Distribution</h3>
      <p className={`${SUB_TEXT} text-xs mb-2`}>Users by device</p>
      <div className="h-44 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={PLATFORM_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={68}
              dataKey="value" labelLine={false} label={PieLabel} strokeWidth={0}>
              {PLATFORM_DATA.map((e,i) => <Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip content={<CustomTooltip/>}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1">
        {PLATFORM_DATA.map(p => (
          <div key={p.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-[#94A3B8]">{p.name}</span></div>
            <span className="text-white font-semibold">{p.value}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Review Sentiment */}
    <div className={`${CARD} p-5`}>
      <h3 className="text-sm font-bold text-white mb-1">Review Sentiment</h3>
      <p className={`${SUB_TEXT} text-xs mb-2`}>Community feedback analysis</p>
      <div className="h-44 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={SENTIMENT_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={68}
              dataKey="value" labelLine={false} label={PieLabel} strokeWidth={0} startAngle={90} endAngle={-270}>
              {SENTIMENT_DATA.map((e,i) => <Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip content={<CustomTooltip/>}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1">
        {SENTIMENT_DATA.map(s => (
          <div key={s.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{background:s.color}}/><span className="text-[#94A3B8]">{s.name}</span></div>
            <span className="text-white font-semibold">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Revenue Forecast */}
    <div className={`${CARD} p-5`}>
      <h3 className="text-sm font-bold text-white mb-1">Revenue Forecast</h3>
      <p className={`${SUB_TEXT} text-xs mb-4`}>6-month projection</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={FORECAST_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill:'#475569',fontSize:10}}/>
            <YAxis axisLine={false} tickLine={false} tick={{fill:'#475569',fontSize:10}} tickFormatter={v=>`$${v/1000}k`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Line dataKey="actual"   stroke="#3B82F6" strokeWidth={2.5} dot={{fill:'#3B82F6',r:3,strokeWidth:0}} connectNulls={false}/>
            <Line dataKey="forecast" stroke="#8B5CF6" strokeWidth={2.5} strokeDasharray="6 3" dot={{fill:'#8B5CF6',r:3,strokeWidth:0}} connectNulls={true}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-2">
        <div className="flex items-center gap-1 text-xs text-[#94A3B8]"><div className="w-4 h-0.5 bg-[#3B82F6]"/> Actual</div>
        <div className="flex items-center gap-1 text-xs text-[#94A3B8]"><div className="w-4 h-0.5 bg-[#8B5CF6] border-dashed"/> Forecast</div>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — QUICK ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const QuickActions = () => (
  <motion.div variants={fadeUp}>
    <div className="flex items-center justify-between mb-4">
      <h2 className={SECTION_TITLE}>Quick Actions</h2>
      <span className={SUB_TEXT}>Manage your platform</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {QUICK_ACTIONS.map((a,i) => (
        <motion.button key={i} whileHover={{y:-6,boxShadow:`0 20px 40px ${a.glow}`}} whileTap={{scale:0.97}}
          className={`${CARD} p-4 flex flex-col items-center gap-3 text-center transition-all cursor-pointer`}>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg`}>
            <a.icon className="w-6 h-6 text-white"/>
          </div>
          <span className="text-xs font-semibold text-white leading-tight">{a.label}</span>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — LATEST REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

const LatestReviews = () => (
  <motion.div variants={fadeUp}>
    <div className="flex items-center justify-between mb-4">
      <h2 className={SECTION_TITLE}>Latest Reviews</h2>
      <button className="text-xs text-[#3B82F6] hover:text-blue-300 transition-colors font-semibold">View All →</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {REVIEWS.map((r,i) => (
        <motion.div key={r.id} variants={fadeUp} className={`${CARD} p-5 flex flex-col gap-3`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center font-bold text-white">
                {r.avatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{r.user}</p>
                <p className="text-[#94A3B8] text-xs">{r.game}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Stars n={r.rating}/>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 ${r.approved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                {r.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
          <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-2">{r.text}</p>
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
            <span className="text-[#475569] text-xs">{r.time}</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-[#94A3B8] hover:text-[#3B82F6] text-xs transition-colors">
                <ThumbsUp className="w-3.5 h-3.5"/>{r.likes}
              </button>
              <button className="p-1.5 hover:bg-white/[0.06] rounded-lg text-[#94A3B8] hover:text-white transition-colors"><MessageCircle className="w-3.5 h-3.5"/></button>
              <button className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-[#94A3B8] hover:text-emerald-400 transition-colors"><CheckCircle className="w-3.5 h-3.5"/></button>
              <button className="p-1.5 hover:bg-rose-500/10 rounded-lg text-[#94A3B8] hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — TRANSACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const TX_STATUS = {
  Success:  'bg-emerald-500/15 text-emerald-400',
  Pending:  'bg-amber-500/15   text-amber-400',
  Refunded: 'bg-blue-500/15    text-blue-400',
  Failed:   'bg-rose-500/15    text-rose-400',
};
const TX_ICON = { Success:CheckCircle, Pending:Clock, Refunded:Repeat, Failed:XCircle };

const Transactions = () => (
  <motion.div variants={fadeUp} className={`${CARD} overflow-hidden`}>
    <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
      <div>
        <h2 className={SECTION_TITLE}>Recent Transactions</h2>
        <p className={`${SUB_TEXT} mt-0.5`}>Latest payment activity</p>
      </div>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-xl text-xs text-[#94A3B8] hover:text-white transition-colors">
        <Download className="w-3.5 h-3.5"/> Export
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {['Invoice','Customer','Method','Amount','Status','Date'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#475569] uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map((tx,i) => {
            const Icon = TX_ICON[tx.status];
            return (
              <motion.tr key={tx.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
                className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                <td className="px-5 py-3 font-mono text-[#3B82F6] text-xs font-semibold">{tx.id}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {tx.customer.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{tx.customer}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#94A3B8] text-xs">{tx.method}</td>
                <td className="px-5 py-3 text-white font-bold">${tx.amount.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${TX_STATUS[tx.status]}`}>
                    <Icon className="w-3 h-3"/>{tx.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#94A3B8] text-xs">{tx.date}</td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — SERVER MONITORING
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  { label:'CPU Usage',         value:68, color:'#3B82F6', icon:Cpu        },
  { label:'RAM Usage',         value:74, color:'#8B5CF6', icon:MonitorDot },
  { label:'Storage',           value:52, color:'#22C55E', icon:HardDrive  },
  { label:'Bandwidth',         value:39, color:'#F59E0B', icon:Wifi       },
  { label:'Database',          value:85, color:'#EF4444', icon:Database   },
  { label:'API Response (ms)', value:42, color:'#06B6D4', icon:Activity   },
];

const ProgressBar = ({ metric }) => {
  const [width, setWidth] = useState(0);
  useEffect(()=>{ setTimeout(()=>setWidth(metric.value),300); }, [metric.value]);
  const Icon = metric.icon;
  const danger = metric.value >= 80;
  const warn   = metric.value >= 60 && metric.value < 80;
  const clr    = danger ? '#EF4444' : warn ? '#F59E0B' : metric.color;

  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`${clr}18`}}>
        <Icon className="w-4 h-4" style={{color:clr}}/>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[#94A3B8] text-xs font-medium">{metric.label}</span>
          <span className="text-white text-xs font-bold" style={{color:clr}}>{metric.value}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div initial={{width:0}} animate={{width:`${width}%`}} transition={{duration:1.2,ease:'easeOut'}}
            className="h-full rounded-full" style={{background:`linear-gradient(90deg, ${clr}80, ${clr})`}}/>
        </div>
      </div>
    </div>
  );
};

const ServerMonitoring = () => (
  <motion.div variants={fadeUp} className={`${CARD} p-5`}>
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className={SECTION_TITLE}>Server Monitoring</h2>
        <p className={`${SUB_TEXT} mt-0.5`}>Real-time infrastructure status</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"/>
        <span className="text-emerald-400 text-xs font-semibold">All Systems Operational</span>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">
      {METRICS.map((m,i) => <ProgressBar key={i} metric={m}/>)}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 — UPCOMING RELEASES
// ─────────────────────────────────────────────────────────────────────────────

const UpcomingReleases = () => (
  <motion.div variants={fadeUp}>
    <div className="flex items-center justify-between mb-4">
      <h2 className={SECTION_TITLE}>Upcoming Releases</h2>
      <button className="text-xs text-[#3B82F6] hover:text-blue-300 transition-colors font-semibold">View Calendar →</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {UPCOMING.map((g,i) => (
        <motion.div key={i} variants={fadeUp} whileHover={{y:-4}} className={`${CARD} overflow-hidden cursor-default`}>
          <div className="relative h-32 bg-slate-900">
            <img src={g.cover} alt={g.name} className="w-full h-full object-cover opacity-60" onError={e=>e.target.style.display='none'}/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e] to-transparent"/>
            <div className="absolute top-3 right-3 bg-[#0B1120]/80 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-[#3B82F6]">
              {g.countdown} left
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-white font-bold text-sm line-clamp-1">{g.name}</h3>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <Globe className="w-3.5 h-3.5"/>{g.platform}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white/[0.04] rounded-xl p-2">
                <p className="text-[#475569] text-[10px]">Est. Revenue</p>
                <p className="text-white font-bold text-sm">{g.revenue}</p>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-2">
                <p className="text-[#475569] text-[10px]">Preorders</p>
                <p className="text-white font-bold text-sm">{g.preorders.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#94A3B8] text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{g.release}</span>
              <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">Coming Soon</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useSelector(s => s.auth);
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7 pb-8">

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            {now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})} · Here's what's happening on your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl text-sm text-[#94A3B8] hover:text-white transition-all">
            <Download className="w-4 h-4"/> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-blue-500 rounded-xl text-sm text-white font-semibold shadow-lg shadow-blue-600/25 transition-all">
            <Plus className="w-4 h-4"/> Add Game
          </button>
        </div>
      </motion.div>

      {/* ── Section 1: Stat Cards ── */}
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map((card,i) => <StatCard key={i} card={card} index={i}/>)}
      </motion.div>

      {/* ── Section 2: Revenue + Activity ── */}
      <RevenueSection/>

      {/* ── Section 3: Top Games Table ── */}
      <TopGamesTable/>

      {/* ── Section 4: Analytics Grid ── */}
      <AnalyticsGrid/>

      {/* ── Section 5: Quick Actions ── */}
      <QuickActions/>

      {/* ── Section 6 + 7: Reviews & Transactions ── */}
      <LatestReviews/>
      <Transactions/>

      {/* ── Section 8: Server Monitoring ── */}
      <ServerMonitoring/>

      {/* ── Section 9: Upcoming Releases ── */}
      <UpcomingReleases/>

    </motion.div>
  );
};

export default Dashboard;
