import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from './Footer'

const CATEGORIES = [
  'Technology', 'Travel', 'Food', 'Lifestyle',
  'Fiction', 'Opinion', 'Health', 'Finance', 'Culture'
]

export default function EditorialLayout({ children }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Sidebar state: collapsed (68px) vs expanded (240px)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  
  // Header state
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false)

  // Current date in broadsheet format
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Close mobile drawers on route change
  useEffect(() => {
    setMobileDrawerOpen(false)
    setNotificationsOpen(false)
    setAvatarMenuOpen(false)
    setCategoriesDrawerOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logoutUser()
    setAvatarMenuOpen(false)
    navigate('/')
  }

  // Ink ripple effect on click
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest('a, button, [role="button"]')
      if (!target) return
      
      const ripple = document.createElement('span')
      ripple.className = 'ink-drop-effect'
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.position = 'absolute'
      ripple.style.borderRadius = '50%'
      ripple.style.pointerEvents = 'none'
      ripple.style.background = 'radial-gradient(circle, rgba(122,28,46,0.25) 0%, transparent 70%)'
      ripple.style.transform = 'scale(0)'
      ripple.style.animation = 'inkDropAnim 0.5s ease-out forwards'

      target.style.position = target.style.position || 'relative'
      target.style.overflow = 'hidden'
      target.appendChild(ripple)
      setTimeout(() => ripple.remove(), 550)
    }

    document.addEventListener('click', handleGlobalClick)
    return () => document.removeEventListener('click', handleGlobalClick)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8] text-[#1A1A1A] relative">
      
      {/* ─── FIXED LEFT SIDEBAR (Desktop) ────────────────────── */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 bg-[#FAF6EE] border-r border-[#DDD2C1] transition-all duration-300 ease-in-out shadow-sm ${
          sidebarExpanded ? 'w-60 shadow-xl' : 'w-16'
        }`}
        style={{
          boxShadow: sidebarExpanded ? '4px 0 24px rgba(26,26,26,0.08)' : 'none'
        }}
      >
        {/* Sidebar Header / Logo Icon */}
        <div className="h-16 flex items-center px-4 border-b border-[#DDD2C1] justify-between overflow-hidden">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7A1C2E] flex items-center justify-center text-[#FAF6EE] font-serif font-black text-base shrink-0 shadow-sm">
              I
            </div>
            <div className={`transition-opacity duration-200 whitespace-nowrap ${sidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="font-serif font-bold text-lg text-[#1A1A1A] tracking-tight">IdeaPad</span>
              <span className="block text-[9px] uppercase tracking-widest text-[#C5A059] font-mono">Press</span>
            </div>
          </Link>
        </div>

        {/* Small visible expander tab on the edge */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          aria-label="Toggle Navigation Sidebar"
          className="absolute -right-3 top-20 w-6 h-6 bg-[#FAF6EE] border border-[#DDD2C1] rounded-full flex items-center justify-center text-[#7A1C2E] text-xs shadow-sm hover:bg-[#EFE8DC] transition-colors z-50 cursor-pointer"
        >
          <span className={`transform transition-transform duration-300 ${sidebarExpanded ? 'rotate-180' : ''}`}>
            ›
          </span>
        </button>

        {/* Navigation items */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {/* Home */}
          <Link
            to="/"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group ${
              location.pathname === '/' ? 'bg-[#EFE8DC] text-[#7A1C2E] font-semibold' : 'text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E]'
            }`}
          >
            <span className="w-5 text-center text-lg shrink-0">🏛</span>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Home
            </span>
          </Link>

          {/* Explore / Archive */}
          <Link
            to="/?q="
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group ${
              location.search.includes('q=') ? 'bg-[#EFE8DC] text-[#7A1C2E]' : 'text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E]'
            }`}
          >
            <span className="w-5 text-center text-lg shrink-0">🧭</span>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Explore Archive
            </span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => setCategoriesDrawerOpen(!categoriesDrawerOpen)}
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E] transition-colors text-left w-full cursor-pointer"
          >
            <span className="w-5 text-center text-lg shrink-0">📂</span>
            <span className={`whitespace-nowrap flex-1 transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Categories
            </span>
            {sidebarExpanded && (
              <span className="text-xs text-[#8F8679]">›</span>
            )}
          </button>

          {/* Authors */}
          <a
            href="/#authors-section"
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E] transition-colors"
          >
            <span className="w-5 text-center text-lg shrink-0">🖋</span>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Authors
            </span>
          </a>

          {/* Bookmarks */}
          <Link
            to="/bookmarks"
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group ${
              location.pathname === '/bookmarks' ? 'bg-[#EFE8DC] text-[#7A1C2E]' : 'text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E]'
            }`}
          >
            <span className="w-5 text-center text-lg shrink-0">🔖</span>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Bookmarks
            </span>
          </Link>

          {/* Settings */}
          {user && (
            <Link
              to="/edit-profile"
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group ${
                location.pathname === '/edit-profile' ? 'bg-[#EFE8DC] text-[#7A1C2E]' : 'text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E]'
              }`}
            >
              <span className="w-5 text-center text-lg shrink-0">⚙</span>
              <span className={`whitespace-nowrap transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                Settings
              </span>
            </Link>
          )}

          {/* About */}
          <button
            onClick={() => setAboutModalOpen(true)}
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium text-[#3A3530] hover:bg-[#F2ECE1] hover:text-[#7A1C2E] transition-colors text-left w-full cursor-pointer"
          >
            <span className="w-5 text-center text-lg shrink-0">ℹ</span>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              About
            </span>
          </button>
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-[#DDD2C1] text-center overflow-hidden">
          <div className={`text-[10px] text-[#8F8679] font-mono tracking-wider transition-opacity duration-200 ${sidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
            EST. 2026 · ISSUE XXIV
          </div>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER OVERLAY ──────────────────────────── */}
      {mobileDrawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-xs flex"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="w-72 bg-[#FAF6EE] h-full shadow-2xl p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DDD2C1]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#7A1C2E] text-[#FAF6EE] flex items-center justify-center font-serif font-bold">
                    I
                  </div>
                  <span className="font-serif font-bold text-xl text-[#1A1A1A]">IdeaPad</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-lg text-[#6B6358] hover:text-[#7A1C2E]"
                >
                  ✕
                </button>
              </div>

              <nav className="py-4 flex flex-col gap-2">
                <Link to="/" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">🏛 Home</Link>
                <Link to="/?q=" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">🧭 Explore</Link>
                <button
                  onClick={() => { setCategoriesDrawerOpen(true); setMobileDrawerOpen(false); }}
                  className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC] text-left"
                >
                  📂 Categories
                </button>
                <a href="/#authors-section" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">🖋 Authors</a>
                <Link to="/bookmarks" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">🔖 Bookmarks</Link>
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">👤 My Profile</Link>
                    <Link to="/edit-profile" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">⚙ Settings</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm text-[#7A1C2E] hover:bg-[#EFE8DC]">🛡 Admin Console</Link>
                    )}
                    <button onClick={handleLogout} className="py-2 px-3 rounded text-sm text-left text-[#7A1C2E] hover:bg-[#EFE8DC]">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC]">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 rounded text-sm hover:bg-[#EFE8DC] text-[#7A1C2E] font-semibold">Join Editorial</Link>
                  </>
                )}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#DDD2C1] text-xs font-mono text-[#8F8679] text-center">
              The Independent Voice of Ideas
            </div>
          </div>
        </div>
      )}

      {/* ─── CATEGORIES FLYOUT DRAWER ──────────────────────── */}
      {categoriesDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1A1A]/30 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCategoriesDrawerOpen(false)}
        >
          <div
            className="paper-card w-full max-w-md p-6 bg-[#FAF6EE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C1] mb-4">
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">Editorial Desks</h3>
              <button
                onClick={() => setCategoriesDrawerOpen(false)}
                className="text-[#8F8679] hover:text-[#7A1C2E] text-sm"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-[#6B6358] mb-4 font-body">
              Select a specialized department to filter essays, opinions, and investigative reports.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/"
                onClick={() => setCategoriesDrawerOpen(false)}
                className="py-2 px-3 rounded border border-[#DDD2C1] text-center text-xs font-mono tracking-wider uppercase hover:bg-[#7A1C2E] hover:text-[#FAF6EE] hover:border-[#7A1C2E] transition-colors"
              >
                All Desks
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  to={`/?genre=${cat}`}
                  onClick={() => setCategoriesDrawerOpen(false)}
                  className="py-2 px-3 rounded border border-[#DDD2C1] text-center text-xs font-mono tracking-wider uppercase hover:bg-[#7A1C2E] hover:text-[#FAF6EE] hover:border-[#7A1C2E] transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ABOUT MODAL ────────────────────────────────────── */}
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="paper-card max-w-lg w-full p-7 bg-[#FAF6EE] border-2 border-[#DDD2C1] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutModalOpen(false)}
              className="absolute top-4 right-4 text-[#8F8679] hover:text-[#7A1C2E] text-base"
            >
              ✕
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#7A1C2E] text-[#FAF6EE] font-serif font-black text-2xl flex items-center justify-center mb-2 shadow-sm">
                I
              </div>
              <h2 className="font-serif font-black text-3xl text-[#1A1A1A]">IdeaPad</h2>
              <p className="byline text-xs text-[#C5A059] mt-1">The Independent Voice of Ideas</p>
              <div className="vintage-rule-double my-4"></div>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-[#3A3530] font-body">
              <p>
                <strong>IdeaPad</strong> is an independent editorial salon and publication platform. Rooted in the timeless aesthetic of historic broadsheets and twentieth-century literary reviews, we provide a haven for considered thought.
              </p>
              <p>
                Every dispatch is published without distracting popups, algorithmic noise, or neon clutter. Here, writing breathes upon ivory paper, with ink that commands respect.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#DDD2C1] flex items-center justify-between text-xs text-[#8F8679] font-mono">
              <span>EST. 2026</span>
              <span>DEVOTED TO THE WRITTEN WORD</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── STICKY TOP HEADER ──────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F7F1E8]/95 backdrop-blur-md border-b border-[#DDD2C1] md:pl-16 transition-all duration-300">
        
        {/* Editorial Sub-bar (Date & Subtitle) */}
        <div className="hidden lg:flex items-center justify-between px-6 py-1 border-b border-[#EFE8DC] text-[11px] font-mono text-[#6B6358]">
          <span>{today.toUpperCase()}</span>
          <span className="tracking-widest uppercase text-[#7A1C2E] font-semibold">
            ✦ THE INDEPENDENT VOICE OF IDEAS ✦
          </span>
          <span>EDITION NO. 142</span>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Mobile hamburger toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 text-[#1A1A1A] hover:text-[#7A1C2E]"
              aria-label="Open navigation drawer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <Link to="/" className="font-serif font-black text-2xl tracking-tight text-[#1A1A1A]">
              IdeaPad
            </Link>
          </div>

          {/* Desktop Grand Masthead Logo */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="group flex items-center gap-2.5">
              <h1 className="font-serif font-black text-3xl tracking-tight text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors">
                IdeaPad
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 border border-[#C5A059] text-[#8C6D2B] font-mono uppercase tracking-wider rounded">
                Gazette
              </span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8679] text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive, essays, authors..."
                className="w-full pl-9 pr-8 py-1.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-full text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/10 transition-all placeholder:font-mono placeholder:text-[#8F8679]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8F8679] hover:text-[#7A1C2E]"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-[#3A3530] hover:text-[#7A1C2E] transition-colors relative cursor-pointer"
                aria-label="Editorial Notifications"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {/* Vintage notification dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7A1C2E] ring-2 ring-[#FAF6EE]"></span>
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 paper-card p-4 shadow-xl z-50 bg-[#FAF6EE] border border-[#DDD2C1] fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1] mb-3">
                    <span className="font-serif font-bold text-sm text-[#1A1A1A]">Editorial Notices</span>
                    <span className="text-[10px] font-mono text-[#7A1C2E]">LATEST DISPATCHES</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2.5 rounded bg-[#EFE8DC]/60 border border-[#DDD2C1]/70">
                      <p className="text-xs font-bold text-[#1A1A1A]">📰 New Edition Released</p>
                      <p className="text-[11px] text-[#6B6358] mt-0.5">Explore featured essays and dispatches across arts and sciences.</p>
                      <span className="text-[9px] font-mono text-[#8F8679] mt-1 block">Just now</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#FAF6EE]">
                      <p className="text-xs font-bold text-[#1A1A1A]">✍ Writer's Guild Open</p>
                      <p className="text-[11px] text-[#6B6358] mt-0.5">Publish your voice to thousands of discerning readers today.</p>
                      <span className="text-[9px] font-mono text-[#8F8679] mt-1 block">2 hours ago</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full text-center mt-3 pt-2 border-t border-[#DDD2C1] text-[11px] font-mono text-[#7A1C2E] hover:underline"
                  >
                    Close Notices
                  </button>
                </div>
              )}
            </div>

            {/* "Write Blog" Button — Newspaper Stamp Styled */}
            <Link
              to="/write"
              className="stamp-btn hidden sm:inline-flex text-xs"
            >
              <span>✍</span> Write Dispatch
            </Link>

            {/* User Profile Avatar / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-[#DDD2C1] hover:border-[#7A1C2E] transition-colors bg-[#FAF6EE]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EFE8DC] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-sm text-[#7A1C2E]">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'C'}
                  </div>
                </button>

                {/* Avatar Menu Dropdown */}
                {avatarMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 paper-card py-2 px-1 shadow-xl z-50 bg-[#FAF6EE] border border-[#DDD2C1] fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2 border-b border-[#DDD2C1] mb-1">
                      <p className="text-xs font-mono text-[#8F8679]">CORRESPONDENT</p>
                      <p className="text-sm font-bold text-[#1A1A1A] truncate">{user.name || user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#3A3530] hover:bg-[#EFE8DC] hover:text-[#7A1C2E] rounded transition-colors"
                    >
                      <span>👤</span> My Dossier / Posts
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#3A3530] hover:bg-[#EFE8DC] hover:text-[#7A1C2E] rounded transition-colors"
                    >
                      <span>🔖</span> Saved Clippings
                    </Link>
                    <Link
                      to="/edit-profile"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#3A3530] hover:bg-[#EFE8DC] hover:text-[#7A1C2E] rounded transition-colors"
                    >
                      <span>⚙</span> Author Credentials
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#7A1C2E] font-semibold hover:bg-[#EFE8DC] rounded transition-colors"
                      >
                        <span>🛡</span> Editor-in-Chief Desk
                      </Link>
                    )}

                    <div className="border-t border-[#DDD2C1] my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#7A1C2E] hover:bg-[#EFE8DC] rounded transition-colors text-left"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="ink-btn-ghost text-xs px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="stamp-btn text-xs px-3 py-1.5"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────── */}
      <div className="flex-1 flex flex-col md:pl-16 transition-all duration-300">
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </div>

    </div>
  )
}
