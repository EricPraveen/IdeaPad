import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../constants/categories'
import Footer from './Footer'

export default function EditorialLayout({ children }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation states
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Date format
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Close modals on route changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMobileDrawerOpen(false)
    setCategoriesDrawerOpen(false)
    setNotificationsOpen(false)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [location.pathname, location.search])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  // Determine active navigation states
  const isHome = location.pathname === '/' && !location.search.includes('q=') && !location.search.includes('genre=')
  const isExplore = location.search.includes('q=') || location.search.includes('genre=')
  const isWrite = location.pathname === '/write'
  const isSaved = location.pathname === '/bookmarks'
  const isProfile = location.pathname === '/profile' || location.pathname.startsWith('/user/')
  const isSettings = location.pathname === '/edit-profile'
  const isAdmin = location.pathname === '/admin'

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E8] text-[#161412] relative font-body antialiased">
      
      {/* ════════════════════════════════════════════════════════════
          FIXED LEFT SIDEBAR NAVIGATION (Desktop: md and up)
          Dark Charcoal / Ink aesthetic, subtle borders, editorial typography
          ════════════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-60 z-40 bg-[#141311] border-r border-[#282521] text-[#FAF6EE] select-none"
        aria-label="Sidebar Navigation"
      >
        {/* Brand Masthead Header */}
        <div className="p-5 border-b border-[#282521]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xs bg-[#7A1C2E] border border-[#581220] flex items-center justify-center font-serif font-black text-base text-[#FAF6EE] shrink-0 shadow-xs group-hover:bg-[#8E2135] transition-colors">
              I
            </div>
            <div className="min-w-0">
              <span className="font-serif font-black text-xl tracking-tight text-[#FAF6EE] block leading-none">
                IDEAPAD
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#A67C48] block mt-1">
                Writing &amp; Publishing
              </span>
            </div>
          </Link>

          <div className="mt-3 pt-2.5 border-t border-[#22201C] flex items-center justify-between text-[10px] font-mono text-[#8E857B]">
            <span>ISSUE 142</span>
            <span>EST. 2026</span>
          </div>
        </div>

        {/* Primary Vertical Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          
          {/* 1. Home */}
          <Link
            to="/"
            className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
              isHome
                ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                : 'text-[#A89F93] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">🏛</span>
              <span>Home</span>
            </div>
            {isHome && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
          </Link>

          {/* 2. Explore */}
          <Link
            to="/?q="
            className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
              isExplore
                ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                : 'text-[#A89F93] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">🧭</span>
              <span>Explore</span>
            </div>
            {isExplore && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
          </Link>

          {/* 3. Categories (Interactive Flyout trigger) */}
          <button
            onClick={() => setCategoriesDrawerOpen(!categoriesDrawerOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 cursor-pointer ${
              categoriesDrawerOpen
                ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#A67C48]'
                : 'text-[#A89F93] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">📂</span>
              <span>Categories</span>
            </div>
            <span className="text-[11px] text-[#8E857B]">
              {categoriesDrawerOpen ? '▴' : '›'}
            </span>
          </button>

          {/* 4. Write */}
          <Link
            to="/write"
            className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
              isWrite
                ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                : 'text-[#A89F93] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">✍</span>
              <span>Write</span>
            </div>
            {isWrite && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
          </Link>

          {/* 5. Saved */}
          <Link
            to="/bookmarks"
            className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
              isSaved
                ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                : 'text-[#A89F93] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">🔖</span>
              <span>Saved</span>
            </div>
            {isSaved && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
          </Link>

          {/* 6. Profile */}
          {user ? (
            <Link
              to="/profile"
              className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
                isProfile
                  ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                  : 'text-[#A89F93] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="text-sm opacity-80">👤</span>
                <span className="truncate">{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
              </div>
              {isProfile && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase text-[#A89F93] border-l-2 border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-80">👤</span>
                <span>Sign In</span>
              </div>
              <span className="text-[10px] text-[#A67C48]">→</span>
            </Link>
          )}

          {/* Admin Console (If authorized) */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
                isAdmin
                  ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                  : 'text-[#C5A059] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🛡</span>
                <span>Admin</span>
              </div>
              {isAdmin && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
            </Link>
          )}

        </nav>

        {/* Sidebar Divider & Bottom Actions */}
        <div className="p-3 border-t border-[#282521] space-y-1">
          
          {/* Settings */}
          <Link
            to={user ? "/edit-profile" : "/login"}
            className={`flex items-center justify-between px-3.5 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-150 border-l-2 ${
              isSettings
                ? 'bg-[#1F1D1A] text-[#FAF6EE] border-[#7A1C2E] font-semibold'
                : 'text-[#8E857B] border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">⚙</span>
              <span>Settings</span>
            </div>
            {isSettings && <span className="text-[10px] text-[#7A1C2E]">✦</span>}
          </Link>

          {/* About Trigger */}
          <button
            onClick={() => setAboutModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono tracking-wider uppercase text-[#8E857B] border-l-2 border-transparent hover:text-[#FAF6EE] hover:bg-[#1A1916] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">ℹ</span>
              <span>About IDEAPAD</span>
            </div>
            <span className="text-[10px] text-[#6E665D]">›</span>
          </button>

          {/* Sign Out */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono tracking-wider uppercase text-[#8E857B] hover:text-[#7A1C2E] hover:bg-[#1A1916] transition-all cursor-pointer border-l-2 border-transparent"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-70">🚪</span>
                <span>Sign Out</span>
              </div>
            </button>
          )}

          {/* Publication Tagline */}
          <div className="pt-3 border-t border-[#22201C] text-[10px] font-mono text-[#6E665D] text-center leading-tight">
            IDEAS WORTH PUBLISHING
          </div>

        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          CENTRALIZED CATEGORIES MODAL / DRAWER
          ════════════════════════════════════════════════════════════ */}
      {categoriesDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#141311]/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCategoriesDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#FAF6EE] border border-[#DDD2C1] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C1] mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#7A1C2E] font-semibold block">
                  CATEGORIES
                </span>
                <h3 className="font-serif font-black text-2xl text-[#161412] mt-0.5">
                  Browse by Topic
                </h3>
              </div>
              <button
                onClick={() => setCategoriesDrawerOpen(false)}
                className="text-sm font-mono text-[#6E665D] hover:text-[#7A1C2E] cursor-pointer p-1"
                aria-label="Close categories"
              >
                ✕ CLOSE
              </button>
            </div>

            <p className="text-xs font-body text-[#5C554D] mb-6 leading-relaxed">
              Explore articles, personal stories, and independent essays organized by topic.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/"
                onClick={() => setCategoriesDrawerOpen(false)}
                className="p-3 border border-[#DDD2C1] bg-[#F7F2E8] hover:border-[#7A1C2E] hover:bg-[#FAF6EE] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#161412] group-hover:text-[#7A1C2E] transition-colors">
                      All Categories
                    </h4>
                    <span className="text-[11px] font-body text-[#6E665D] block">
                      Browse all published articles
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#A67C48]">›</span>
              </Link>

              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  to={`/?genre=${cat.name}`}
                  onClick={() => setCategoriesDrawerOpen(false)}
                  className="p-3 border border-[#DDD2C1] bg-[#FAF6EE] hover:border-[#7A1C2E] hover:bg-[#EFE8DC] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#161412] group-hover:text-[#7A1C2E] transition-colors">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] font-body text-[#6E665D] block line-clamp-1">
                        {cat.desc}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#A67C48]">›</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          ABOUT IDEAPAD MODAL
          ════════════════════════════════════════════════════════════ */}
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#141311]/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FAF6EE] border border-[#DDD2C1] shadow-2xl p-7 sm:p-9 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutModalOpen(false)}
              className="absolute top-5 right-5 text-sm font-mono text-[#6E665D] hover:text-[#7A1C2E] cursor-pointer"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-xs bg-[#7A1C2E] text-[#FAF6EE] font-serif font-black text-2xl flex items-center justify-center mb-2 shadow-xs">
                I
              </div>
              <h2 className="font-serif font-black text-3xl text-[#161412]">IDEAPAD</h2>
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#A67C48] mt-1 font-semibold">
                A Place for Ideas Worth Publishing
              </p>
              <div className="editorial-rule-double my-4"></div>
            </div>
            <div className="space-y-3.5 text-sm leading-relaxed text-[#35312C] font-body">
              <p>
                <strong>IDEAPAD</strong> is an independent editorial publishing platform built for thoughtful writers and curious readers. Designed with classic editorial typography and paper aesthetics, it provides a clean, focused reading and writing environment.
              </p>
              <p>
                Anyone can join, compose essays, and publish articles on technology, culture, design, and ideas without algorithmic noise or clutter.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#DDD2C1] flex items-center justify-between text-xs text-[#8E857B] font-mono">
              <span>EST. 2026</span>
              <span>DEVOTED TO THE WRITTEN WORD</span>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MOBILE NAVIGATION DRAWER (Phones and small tablets)
          ════════════════════════════════════════════════════════════ */}
      {mobileDrawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-[#141311]/60 backdrop-blur-xs flex"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="w-72 bg-[#141311] h-full shadow-2xl p-5 flex flex-col justify-between text-[#FAF6EE] border-r border-[#282521]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#282521]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xs bg-[#7A1C2E] text-[#FAF6EE] flex items-center justify-center font-serif font-bold text-sm">
                    I
                  </div>
                  <div>
                    <span className="font-serif font-bold text-lg text-[#FAF6EE] block leading-none">
                      IDEAPAD
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#A67C48]">
                      Publishing
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-sm font-mono text-[#8E857B] hover:text-[#FAF6EE]"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="py-4 flex flex-col gap-1 text-xs font-mono uppercase tracking-wider">
                <Link to="/" onClick={() => setMobileDrawerOpen(false)} className={`py-2.5 px-3 rounded-xs flex items-center gap-3 ${isHome ? 'bg-[#1F1D1A] text-[#FAF6EE] border-l-2 border-[#7A1C2E]' : 'text-[#A89F93] hover:bg-[#1A1916]'}`}>
                  <span>🏛</span> Home
                </Link>
                <Link to="/?q=" onClick={() => setMobileDrawerOpen(false)} className={`py-2.5 px-3 rounded-xs flex items-center gap-3 ${isExplore ? 'bg-[#1F1D1A] text-[#FAF6EE] border-l-2 border-[#7A1C2E]' : 'text-[#A89F93] hover:bg-[#1A1916]'}`}>
                  <span>🧭</span> Explore
                </Link>
                <button
                  onClick={() => { setCategoriesDrawerOpen(true); setMobileDrawerOpen(false); }}
                  className="py-2.5 px-3 rounded-xs flex items-center justify-between text-[#A89F93] hover:bg-[#1A1916] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span>📂</span> Categories
                  </div>
                  <span className="text-xs">›</span>
                </button>
                <Link to="/write" onClick={() => setMobileDrawerOpen(false)} className={`py-2.5 px-3 rounded-xs flex items-center gap-3 ${isWrite ? 'bg-[#1F1D1A] text-[#FAF6EE] border-l-2 border-[#7A1C2E]' : 'text-[#A89F93] hover:bg-[#1A1916]'}`}>
                  <span>✍</span> Write
                </Link>
                <Link to="/bookmarks" onClick={() => setMobileDrawerOpen(false)} className={`py-2.5 px-3 rounded-xs flex items-center gap-3 ${isSaved ? 'bg-[#1F1D1A] text-[#FAF6EE] border-l-2 border-[#7A1C2E]' : 'text-[#A89F93] hover:bg-[#1A1916]'}`}>
                  <span>🔖</span> Saved
                </Link>

                <div className="border-t border-[#282521] my-2"></div>

                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileDrawerOpen(false)} className="py-2.5 px-3 rounded-xs flex items-center gap-3 text-[#A89F93] hover:bg-[#1A1916]">
                      <span>👤</span> My Profile
                    </Link>
                    <Link to="/edit-profile" onClick={() => setMobileDrawerOpen(false)} className="py-2.5 px-3 rounded-xs flex items-center gap-3 text-[#A89F93] hover:bg-[#1A1916]">
                      <span>⚙</span> Settings
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileDrawerOpen(false)} className="py-2.5 px-3 rounded-xs flex items-center gap-3 text-[#C5A059] hover:bg-[#1A1916]">
                        <span>🛡</span> Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="py-2.5 px-3 rounded-xs flex items-center gap-3 text-[#7A1C2E] hover:bg-[#1A1916] text-left cursor-pointer">
                      <span>🚪</span> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileDrawerOpen(false)} className="py-2.5 px-3 rounded-xs flex items-center gap-3 text-[#A89F93] hover:bg-[#1A1916]">
                      <span>👤</span> Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileDrawerOpen(false)} className="py-2.5 px-3 rounded-xs flex items-center gap-3 text-[#7A1C2E] font-semibold hover:bg-[#1A1916]">
                      <span>✦</span> Create Account
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#282521] text-[10px] font-mono text-[#8E857B] text-center">
              A PLACE FOR IDEAS WORTH PUBLISHING
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STREAMLINED TOP HEADER
          ════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-[#F7F2E8]/95 backdrop-blur-xs border-b border-[#DDD2C1] md:pl-60 transition-all duration-200">
        
        {/* Top date bar */}
        <div className="hidden lg:flex items-center justify-between px-6 py-1 border-b border-[#EFE8DC] text-[10px] font-mono text-[#6E665D]">
          <span>{today.toUpperCase()}</span>
          <span className="tracking-[0.25em] uppercase text-[#7A1C2E] font-semibold">
            ✦ A PLACE FOR IDEAS WORTH PUBLISHING ✦
          </span>
          <span>EDITION 142</span>
        </div>

        {/* Top Action Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Mobile hamburger & brand name */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1.5 text-[#161412] hover:text-[#7A1C2E] cursor-pointer"
              aria-label="Open mobile menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <Link to="/" className="font-serif font-black text-xl tracking-tight text-[#161412]">
              IDEAPAD
            </Link>
          </div>

          {/* Center search bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E857B] text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, authors..."
                className="w-full pl-8 pr-7 py-1.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs font-body text-[#161412] focus:outline-none focus:border-[#7A1C2E] placeholder:font-mono placeholder:text-[#8E857B] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8E857B] hover:text-[#7A1C2E] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Notification trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 text-[#35312C] hover:text-[#7A1C2E] transition-colors cursor-pointer relative"
                aria-label="Notifications"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#7A1C2E]"></span>
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-[#FAF6EE] border border-[#DDD2C1] shadow-xl p-4 z-50 fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1] mb-2.5">
                    <span className="font-serif font-bold text-xs text-[#161412]">Latest Updates</span>
                    <span className="text-[9px] font-mono text-[#7A1C2E] uppercase">Notices</span>
                  </div>
                  <div className="space-y-2.5 text-left">
                    <div className="p-2 border border-[#DDD2C1] bg-[#F7F2E8]">
                      <p className="text-xs font-bold text-[#161412]">📰 Fresh Edition Published</p>
                      <p className="text-[11px] text-[#5C554D] mt-0.5">Check out trending articles across technology, culture, and science.</p>
                      <span className="text-[9px] font-mono text-[#8E857B] mt-1 block">Edition No. 142</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full text-center mt-2.5 pt-2 border-t border-[#DDD2C1] text-[10px] font-mono text-[#7A1C2E] hover:underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Write CTA */}
            <Link
              to="/write"
              className="stamp-btn text-[11px] py-1.5 px-3.5 hidden sm:inline-flex"
            >
              <span>✍</span> Write
            </Link>

            {/* Auth / Profile avatar */}
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 rounded-xs border border-[#DDD2C1] hover:border-[#7A1C2E] bg-[#FAF6EE] transition-colors"
                title={user.name || user.email}
              >
                <div className="w-7 h-7 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-xs text-[#7A1C2E]">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="editorial-btn-secondary text-[11px] py-1.5 px-3"
              >
                Sign In
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
          ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col md:pl-60 transition-all duration-200">
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </div>

    </div>
  )
}
