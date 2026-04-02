import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Bell, CheckCircle2, Menu, X as XIcon, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Cursor from './components/ui/inverted-cursor';
import ParticleBackground from './components/ui/particle-background';
import { GooeyLoader } from './components/ui/loader-10';

// Global transition loader
function GlobalLoader() {
  return (
    <div className="flex-1 flex justify-center items-center h-full relative z-[100] w-full min-h-[60vh] flex-col gap-12">
      <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] animate-pulse">
        CodeLensAI is Loading
      </h2>
      <GooeyLoader
        primaryColor="var(--primary)"
        secondaryColor="var(--secondary)"
        borderColor="transparent"
        className="scale-75 md:scale-100"
      />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isFirebaseReady } = useAuth();
  // If Firebase isn't configured, allow access (dev mode / no auth setup yet)
  if (!isFirebaseReady) return <>{children}</>;
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isPublic = isHome || isLogin;
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Trigger loading screen between Home and Analyzer, and anytime switching back to Home
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      const p = prevPathRef.current;
      prevPathRef.current = location.pathname;
      
      const isFromHomeToAnalyzer = p === '/' && location.pathname === '/analyzer';
      const isFromAnywhereToHome = p !== '/' && location.pathname === '/';

      if (isFromHomeToAnalyzer || isFromAnywhereToHome) {
        setIsNavigating(true);
        setTimeout(() => setIsNavigating(false), 3000); // 3 seconds as requested
      }
    }
  }, [location.pathname]);

  const userInitial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans relative overflow-x-hidden md:cursor-none">
      <div className="hidden md:block"><Cursor size={70} /></div>
      <ParticleBackground />

      {isPublic ? (
        <>
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 relative z-10 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] rounded-md"></div>
            <span>CodeLens AI</span>
          </Link>
          {isHome && (
            <div className="hidden md:flex items-center space-x-8 text-sm text-[var(--outline)]">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">How it Works</button>
              <button onClick={() => document.getElementById('changelog')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Changelog</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Pricing</button>
            </div>
          )}
          <div className="flex items-center gap-3">
            {user ? (
              <Link 
                to="/analyzer" 
                className="hidden sm:inline-block px-5 py-2 rounded-full text-sm font-medium bg-[var(--surface-bright)] hover:bg-[var(--surface-container-highest)] border border-[var(--outline)]/20 transition-all"
              >
                Launch App
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:inline-block px-5 py-2 rounded-full text-sm font-medium bg-[var(--surface-bright)] hover:bg-[var(--surface-container-highest)] border border-[var(--outline)]/20 transition-all"
              >
                Sign In
              </Link>
            )}
            {isHome && (
              <button 
                className="md:hidden p-2 text-[var(--outline)] hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </nav>
        {/* Mobile menu for home */}
        {isHome && mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--surface-container)]/95 backdrop-blur-xl border-b border-[var(--border)] z-50 px-4 py-6 flex flex-col gap-4 text-sm">
            <button onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-left text-[var(--outline)] hover:text-white transition-colors py-2">Features</button>
            <button onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-left text-[var(--outline)] hover:text-white transition-colors py-2">How it Works</button>
            <button onClick={() => { document.getElementById('changelog')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-left text-[var(--outline)] hover:text-white transition-colors py-2">Changelog</button>
            <button onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-left text-[var(--outline)] hover:text-white transition-colors py-2">Pricing</button>
            <Link to={user ? "/analyzer" : "/login"} className="sm:hidden px-5 py-2 rounded-full text-sm font-medium bg-[var(--surface-bright)] border border-[var(--outline)]/20 text-center" onClick={() => setMobileMenuOpen(false)}>{user ? 'Launch App' : 'Sign In'}</Link>
          </div>
        )}
        </>
      ) : (
        <>
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 relative z-50 max-w-7xl mx-auto w-full">
          {/* Logo - Matches Home Page */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] rounded-md"></div>
            <span>CodeLens AI</span>
          </Link>
          
          {/* Desktop nav links - Centered like Home Page */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <Link to="/analyzer" className={`hover:text-white transition-colors ${location.pathname === '/analyzer' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1' : 'text-[var(--outline)]'}`}>Analyzer</Link>
            <Link to="/history" className={`hover:text-white transition-colors ${location.pathname === '/history' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1' : 'text-[var(--outline)]'}`}>History</Link>
            <Link to="/settings" className={`hover:text-white transition-colors ${location.pathname === '/settings' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1' : 'text-[var(--outline)]'}`}>Settings</Link>
          </div>

          <div className="flex items-center gap-4 text-[var(--outline)] relative">
            {/* Notification bell */}
            <button 
               onClick={() => {
                 setShowNotifications(!showNotifications);
                 if (unreadCount > 0) markAllAsRead();
               }}
               className="hover:text-white transition-colors relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* User avatar with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="shrink-0 focus:outline-none"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border-2 border-transparent hover:border-[var(--primary)] transition-all" />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-[var(--primary)]/50 transition-all">
                    {userInitial}
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute top-10 right-0 w-64 bg-[var(--surface-container-high)] border border-[var(--border)] shadow-2xl rounded-xl z-[60] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <div className="text-sm font-bold text-[var(--on-surface)] truncate">{user?.displayName || 'User'}</div>
                    <div className="text-xs text-[var(--outline)] truncate">{user?.email}</div>
                  </div>
                  <button
                    onClick={async () => { setShowUserMenu(false); await logout(); }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button 
              className="sm:hidden p-1 text-[var(--outline)] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Notification dropdown */}
        {showNotifications && (
          <div className="fixed sm:absolute top-14 sm:top-auto right-2 sm:right-4 w-[calc(100vw-16px)] sm:w-80 bg-[var(--surface-container-high)] border border-[var(--border)] shadow-2xl rounded-xl z-[60] overflow-hidden flex flex-col max-h-[70vh]">
            <div className="px-4 py-3 border-b border-[var(--border)] font-bold text-[var(--on-surface)] flex justify-between items-center shrink-0">
              <span>Notifications</span>
              {notifications.length > 0 && <span className="text-xs text-[var(--outline)]">{notifications.length} total</span>}
            </div>
            <div className="overflow-y-auto w-full">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--outline)]">No notifications yet.</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-3 md:p-4 border-b border-[var(--border)]/50 text-sm ${!n.read ? 'bg-[var(--primary)]/10' : ''}`}>
                     <div className="flex items-start gap-3">
                       <CheckCircle2 size={16} className="text-[var(--primary)] mt-0.5 shrink-0" />
                       <div>
                         <p className="text-[var(--on-surface)] leading-tight text-xs md:text-sm">{n.message}</p>
                         <span className="text-xs text-[var(--outline)] mt-1 block">
                           {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                       </div>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Mobile app nav menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[var(--surface-container)]/95 backdrop-blur-xl border-b border-[var(--border)] z-50 px-4 py-4 flex flex-col gap-1">
            <Link to="/analyzer" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${location.pathname === '/analyzer' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--outline)] hover:bg-white/5 hover:text-white'}`}>Analyzer</Link>
            <Link to="/history" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${location.pathname === '/history' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--outline)] hover:bg-white/5 hover:text-white'}`}>History</Link>
            <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${location.pathname === '/settings' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--outline)] hover:bg-white/5 hover:text-white'}`}>Settings</Link>
          </div>
        )}
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 w-full min-h-0">
        {isNavigating ? (
          <GlobalLoader />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
