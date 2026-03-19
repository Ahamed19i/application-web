

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff,
  CheckCircle,
  Clock,
  X,
  Save,
  FileDown,
  BarChart3,
  TrendingUp,
  Users
} from 'lucide-react';
import { Project, Post, Message } from '../types';
import { generateProjectReport } from '../utils/reportGenerator';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'posts' | 'messages' | 'analytics'>('stats');
  const [stats, setStats] = useState({ projects: 0, posts: 0, unreadMessages: 0 });
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, projectsRes, postsRes, messagesRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/projects', { headers }),
        fetch('/api/admin/posts', { headers }),
        fetch('/api/messages', { headers }),
        fetch('/api/admin/analytics', { headers })
      ]);

      if (statsRes.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
        return;
      }

      setStats(await statsRes.json());
      setProjects(await projectsRes.json());
      setPosts(await postsRes.json());
      setMessages(await messagesRes.json());
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        console.log("Analytics data fetched (v1.2):", data);
        setAnalytics(data);
      } else {
        console.error("Analytics fetch failed with status:", analyticsRes.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const deleteItem = async (type: 'projects' | 'posts' | 'messages', id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (type: 'projects' | 'posts', item: any) => {
    try {
      const res = await fetch(`/api/${type}/${item.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...item, published: item.published ? 0 : 1 })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      if (activeTab === 'projects') {
        setFormData({
          title: '',
          description: '',
          content: '',
          stack: '',
          github_url: '',
          pdf_url: '',
          image_url: '',
          category: 'Réseau',
          status: 'En cours',
          published: 1
        });
      } else if (activeTab === 'posts') {
        setFormData({
          title: '',
          slug: '',
          content: '',
          pdf_url: '',
          image_url: '',
          category: 'Cloud/DevOps',
          tags: '',
          published: 1
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = activeTab;
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/${type}/${editingItem.id}` : `/api/${type}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Erreur lors de l'enregistrement : ${errorData.message || errorData.details || 'Erreur inconnue'}`);
        console.error('Détails de l\'erreur:', errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-y-0 border-l-0 flex flex-col">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
              <LayoutDashboard className="text-accent-primary w-5 h-5" />
            </div>
            <span className="font-mono font-bold tracking-tighter">ADMIN PANEL</span>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Ahamed Hassani</p>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'stats', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'analytics', label: 'Analytiques', icon: BarChart3, isNew: true },
            { id: 'projects', label: 'Projets', icon: FolderKanban },
            { id: 'posts', label: 'Blog', icon: FileText },
            { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
          ].map((item: { id: string, label: string, icon: any, isNew?: boolean, badge?: number }) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-accent-primary/10 text-accent-primary' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.isNew && (
                  <span className="ml-2 bg-accent-primary/20 text-accent-primary text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                    NEW
                  </span>
                )}
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-accent-primary text-bg text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
              {(activeTab === 'projects' || activeTab === 'posts') && (
                <button 
                  onClick={() => openModal()}
                  className="px-6 py-2 bg-accent-primary text-bg font-bold rounded-xl flex items-center gap-2 hover:glow-primary transition-all"
                >
                  <Plus size={20} /> Nouveau
                </button>
              )}
            </div>

            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="grid grid-cols-4 gap-8">
                  <div className="glass p-8 rounded-3xl">
                    <Users className="text-accent-primary mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Visiteurs (30j)</p>
                    <p className="text-4xl font-mono font-bold">{analytics?.last30Days || 0}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <FolderKanban className="text-accent-primary mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Projets</p>
                    <p className="text-4xl font-mono font-bold">{stats.projects}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <FileText className="text-accent-secondary mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Articles</p>
                    <p className="text-4xl font-mono font-bold">{stats.posts}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <MessageSquare className="text-white mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Messages</p>
                    <p className="text-4xl font-mono font-bold">{stats.unreadMessages}</p>
                  </div>
                </div>

                {analytics && (
                  <div className="glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <TrendingUp className="text-accent-primary" />
                        Aperçu des Visites
                      </h3>
                      <button 
                        onClick={() => setActiveTab('analytics')}
                        className="text-xs font-mono text-accent-primary uppercase tracking-widest hover:underline"
                      >
                        Voir détails
                      </button>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.chartData}>
                          <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="rgba(255,255,255,0.3)" 
                            fontSize={10} 
                            tickLine={false}
                            axisLine={false}
                            interval={4}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.3)" 
                            fontSize={10} 
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(10, 10, 20, 0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}
                            itemStyle={{ color: '#00f2ff' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="visits" 
                            stroke="#00f2ff" 
                            fillOpacity={1} 
                            fill="url(#colorVisits)" 
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="glass p-10 rounded-3xl border-accent-primary/20 bg-gradient-to-br from-accent-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <FileDown className="text-accent-primary" />
                      Rapport de Projet DevOps
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      Générez un rapport professionnel au format Word (.docx) détaillant l'architecture de l'application, la stratégie de déploiement (Netlify vs Vercel) et le pipeline CI/CD. Idéal pour vos dossiers académiques ou présentations techniques.
                    </p>
                  </div>
                  <button 
                    onClick={generateProjectReport}
                    className="px-8 py-4 bg-accent-primary text-bg font-bold rounded-2xl flex items-center gap-3 hover:glow-primary transition-all whitespace-nowrap"
                  >
                    <FileDown size={20} />
                    Télécharger le Rapport
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {analytics?.error && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm">
                    ⚠️ {analytics.error}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-8">
                  <div className="glass p-8 rounded-3xl">
                    <Clock className="text-accent-primary mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Aujourd'hui</p>
                    <p className="text-4xl font-mono font-bold">{analytics?.today || 0}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <TrendingUp className="text-accent-secondary mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">7 derniers jours</p>
                    <p className="text-4xl font-mono font-bold">{analytics?.last7Days || 0}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <Users className="text-white mb-4" size={32} />
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-1">30 derniers jours</p>
                    <p className="text-4xl font-mono font-bold">{analytics?.last30Days || 0}</p>
                  </div>
                </div>

                <div className="glass p-10 rounded-3xl">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <BarChart3 className="text-accent-primary" />
                    Évolution du Trafic (30 jours)
                  </h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics?.chartData}>
                        <defs>
                          <linearGradient id="colorVisitsFull" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 20, 0.9)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px'
                          }}
                          itemStyle={{ color: '#00f2ff' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visits" 
                          stroke="#00f2ff" 
                          fillOpacity={1} 
                          fill="url(#colorVisitsFull)" 
                          strokeWidth={4}
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl border-white/5">
                  <h4 className="text-lg font-bold mb-4">Pourquoi ces données sont importantes ?</h4>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Le suivi du trafic vous permet de mesurer l'impact de vos publications sur le blog et de vos nouveaux projets. 
                    Une augmentation soudaine peut indiquer qu'un de vos articles a été partagé ou que votre SEO s'améliore. 
                    Utilisez ces informations pour décider quels sujets intéressent le plus votre audience.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Titre</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Catégorie</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Statut</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Visibilité</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold">{project.title}</td>
                        <td className="px-6 py-4 text-white/60">{project.category}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2 py-1 rounded ${
                            project.status === 'Terminé' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => togglePublish('projects', project)}>
                            {project.published ? <Eye className="text-accent-primary" size={18} /> : <EyeOff className="text-white/20" size={18} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 flex gap-3">
                          <button onClick={() => openModal(project)} className="text-white/40 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => deleteItem('projects', project.id)} className="text-red-500/40 hover:text-red-500"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Titre</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Date</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Visibilité</th>
                      <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold">{post.title}</td>
                        <td className="px-6 py-4 text-white/40 text-sm">{new Date(post.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => togglePublish('posts', post)}>
                            {post.published ? <Eye className="text-accent-primary" size={18} /> : <EyeOff className="text-white/20" size={18} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 flex gap-3">
                          <button onClick={() => openModal(post)} className="text-white/40 hover:text-white"><Edit size={18} /></button>
                          <button onClick={() => deleteItem('posts', post.id)} className="text-red-500/40 hover:text-red-500"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`glass p-6 rounded-2xl border-l-4 ${msg.read ? 'border-white/10' : 'border-accent-primary'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{msg.subject}</h4>
                        <p className="text-sm text-white/60">{msg.name} ({msg.email})</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-white/30 font-mono">{new Date(msg.created_at).toLocaleString()}</span>
                        <button onClick={() => deleteItem('messages', msg.id)} className="text-red-500/40 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-white/80 bg-white/5 p-4 rounded-xl">{msg.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center py-20 glass rounded-3xl text-white/40">Aucun message</div>}
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  {editingItem ? 'Modifier' : 'Nouveau'} {activeTab === 'projects' ? 'Projet' : 'Article'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Titre</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                      {activeTab === 'projects' ? 'Catégorie' : 'Slug'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={activeTab === 'projects' ? formData.category : formData.slug || ''}
                      onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'category' : 'slug']: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                    />
                  </div>
                </div>

                {activeTab === 'projects' && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Description Courte</label>
                    <input 
                      type="text" 
                      required
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Contenu (Markdown)</label>
                  <textarea 
                    required
                    rows={8}
                    value={formData.content || ''}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">URL Image</label>
                    <input 
                      type="text" 
                      value={formData.image_url || ''}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">URL PDF (GitHub Raw)</label>
                    <input 
                      type="text" 
                      value={formData.pdf_url || ''}
                      onChange={e => setFormData({...formData, pdf_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                      placeholder="https://raw.githubusercontent.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                    {activeTab === 'projects' ? 'Stack (séparé par des virgules)' : 'Tags (séparés par des virgules)'}
                  </label>
                  <input 
                    type="text" 
                    value={activeTab === 'projects' ? formData.stack : formData.tags || ''}
                    onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'stack' : 'tags']: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                  />
                </div>

                {activeTab === 'projects' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase tracking-widest">GitHub URL</label>
                      <input 
                        type="text" 
                        value={formData.github_url || ''}
                        onChange={e => setFormData({...formData, github_url: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Statut</label>
                      <select 
                        value={formData.status || 'En cours'}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none"
                      >
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Archivé">Archivé</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-white/60 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-accent-primary text-bg font-bold rounded-xl flex items-center gap-2 hover:glow-primary transition-all"
                  >
                    <Save size={20} /> Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};