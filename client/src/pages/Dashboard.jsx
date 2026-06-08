import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [connectedRepos, setConnectedRepos] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchConnectedRepos();
  }, [user]);

  const fetchConnectedRepos = async () => {
    try {
      const res = await api.get('/repos/connected');
      setConnectedRepos(res.data);
    } catch (err) {
      console.error('Failed to fetch connected repos');
    }
  };

  const fetchGithubRepos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/repos/github');
      setGithubRepos(res.data);
      setShowRepoModal(true);
    } catch (err) {
      console.error('Failed to fetch GitHub repos');
    } finally {
      setLoading(false);
    }
  };

  const connectRepo = async (repo) => {
    try {
      await api.post('/repos/connect', {
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        owner: repo.owner.login,
        url: repo.html_url
      });
      fetchConnectedRepos();
      setShowRepoModal(false);
    } catch (err) {
      alert('Failed to connect repository');
    }
  };

  const disconnectRepo = async (githubId) => {
    try {
      await api.delete(`/repos/${githubId}`);
      fetchConnectedRepos();
    } catch (err) {
      alert('Failed to disconnect repository');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          DevFlow
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <img src={user?.avatarUrl} alt={user?.username} className="w-8 h-8 rounded-full border border-white/20" />
            <span className="font-medium text-slate-300">{user?.username}</span>
          </div>
          <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-white px-3 py-1 hover:bg-white/5 rounded-lg">
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold">Dashboard</h1>
              <p className="text-slate-400 mt-2 text-lg">Manage your connected repositories.</p>
            </div>
            <button
              onClick={fetchGithubRepos}
              disabled={loading}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Loading...' : '+ Connect Repo'}
            </button>
          </header>

          <section>
            <h3 className="text-xl font-bold mb-6 text-slate-300 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              Connected Repositories ({connectedRepos.length})
            </h3>
            
            {connectedRepos.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl text-center text-slate-500 italic">
                No repositories connected yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedRepos.map(repo => (
                  <div key={repo.githubId} className="group p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-blue-500/50 transition-all shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <button onClick={() => disconnectRepo(repo.githubId)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <h4 className="font-bold text-lg text-slate-100 truncate">{repo.name}</h4>
                    <p className="text-sm text-slate-400 mt-1 truncate">{repo.fullName}</p>
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md font-mono uppercase">Connected</span>
                      <a href={repo.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white underline">GitHub</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {showRepoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold">Select a Repository</h3>
              <button onClick={() => setShowRepoModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {githubRepos.map(repo => {
                const isAlreadyConnected = connectedRepos.some(cr => cr.githubId === repo.id);
                return (
                  <div key={repo.id} className={`flex justify-between items-center p-4 rounded-xl border ${isAlreadyConnected ? 'opacity-50' : 'hover:border-blue-500/30'}`}>
                    <div>
                      <p className="font-bold">{repo.name}</p>
                      <p className="text-xs text-slate-500">{repo.full_name}</p>
                    </div>
                    {isAlreadyConnected ? <span className="text-xs italic">Connected</span> : (
                      <button onClick={() => connectRepo(repo)} className="px-4 py-1 bg-blue-500 rounded-lg text-sm font-bold">Connect</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;