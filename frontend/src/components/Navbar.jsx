import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const genres = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Fiction', 'Opinion', 'Health', 'Finance', 'Culture']

export default function Navbar() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = () => {
        logoutUser()
        navigate('/')
        setMenuOpen(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery)}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <>
            {/* Top utility bar */}
            <div className="bg-[#1F1B16] text-[#B08968] text-xs py-1.5 px-6 flex justify-between items-center" style={{ fontFamily: "'Special Elite', monospace" }}>
                <span className="hidden sm:block uppercase tracking-widest opacity-80">{today}</span>
                <div className="flex items-center gap-5">
                    {user ? (
                        <>
                            <Link to="/write" className="hover:text-[#F5EAD7] transition-colors uppercase tracking-wider">
                                ✍ Write
                            </Link>
                            <Link to="/bookmarks" className="hover:text-[#F5EAD7] transition-colors uppercase tracking-wider">
                                Bookmarks
                            </Link>
                            <Link to="/profile" className="hover:text-[#F5EAD7] transition-colors uppercase tracking-wider">
                                {user.name || user.username || 'Profile'}
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-[#7A2E2E] hover:text-red-400 transition-colors uppercase tracking-wider">
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="hover:text-[#F5EAD7] transition-colors uppercase tracking-wider">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-[#F5EAD7] transition-colors uppercase tracking-wider">
                                Sign In
                            </Link>
                            <Link to="/register" className="hover:text-[#F5EAD7] transition-colors uppercase tracking-wider">
                                Register
                            </Link>
                        </>
                    )}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        aria-label="Search"
                        className="hover:text-[#F5EAD7] transition-colors"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search bar dropdown */}
            {searchOpen && (
                <div className="bg-[#EADCC5] border-b border-[#C8B89A] px-6 py-3 fade-in">
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search the archive..."
                            className="ink-input flex-1 text-sm"
                        />
                        <button type="submit" className="ink-btn text-xs">Search</button>
                        <button type="button" onClick={() => setSearchOpen(false)} className="ink-btn-ghost text-xs">✕</button>
                    </form>
                </div>
            )}

            {/* Main Masthead */}
            <header className="bg-[#FAF6EE] border-b-2 border-[#1F1B16] py-6 px-6">
                <div className="max-w-6xl mx-auto text-center relative">
                    {/* Decorative lines */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-px bg-[#1F1B16]"></div>
                        <div className="h-1 w-1 rounded-full bg-[#7A2E2E]"></div>
                        <div className="flex-1 h-px bg-[#1F1B16]"></div>
                    </div>

                    {/* Logo + Title */}
                    <Link to="/" className="inline-flex items-center justify-center gap-3 group">
                        <img src="/favicon.png" alt="IdeaPad" className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                        <h1
                            className="text-5xl md:text-6xl font-black tracking-tight text-[#1F1B16] group-hover:text-[#7A2E2E] transition-colors"
                            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
                        >
                            IdeaPad
                        </h1>
                    </Link>

                    <p className="mt-2 text-xs tracking-[0.3em] uppercase text-[#8B5A2B]" style={{ fontFamily: "'Special Elite', monospace" }}>
                        The Independent Voice of Ideas
                    </p>

                    {/* Decorative lines */}
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1 h-px bg-[#1F1B16]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#7A2E2E]"></div>
                        <div className="flex-1 h-px bg-[#1F1B16]"></div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-1">
                            <span className={`block h-0.5 w-5 bg-[#1F1B16] transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`block h-0.5 w-5 bg-[#1F1B16] transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-5 bg-[#1F1B16] transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>
                </div>
            </header>

            {/* Category navigation strip */}
            <nav className="bg-[#1F1B16] py-2 px-6 hidden md:block">
                <div className="max-w-6xl mx-auto flex items-center justify-center gap-1 flex-wrap">
                    <Link to="/" className="text-[#B08968] hover:text-[#F5EAD7] text-xs px-3 py-1 transition-colors border-r border-[#3A3530]" style={{ fontFamily: "'Special Elite', monospace", letterSpacing: '0.12em' }}>
                        ALL
                    </Link>
                    {genres.map((g, i) => (
                        <Link
                            key={g}
                            to={`/?genre=${g}`}
                            className={`text-[#B08968] hover:text-[#F5EAD7] text-xs px-3 py-1 transition-colors ${i < genres.length - 1 ? 'border-r border-[#3A3530]' : ''}`}
                            style={{ fontFamily: "'Special Elite', monospace", letterSpacing: '0.12em' }}
                        >
                            {g.toUpperCase()}
                        </Link>
                    ))}
                    {!user && (
                        <Link to="/register" className="ml-4 stamp-btn text-xs">
                            Subscribe
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile menu drawer */}
            {menuOpen && (
                <div className="md:hidden bg-[#FAF6EE] border-b-2 border-[#1F1B16] px-6 py-4 paper-slide">
                    <div className="flex flex-col gap-3">
                        {genres.map(g => (
                            <Link
                                key={g}
                                to={`/?genre=${g}`}
                                onClick={() => setMenuOpen(false)}
                                className="text-[#1F1B16] hover:text-[#7A2E2E] text-sm py-1 border-b border-[#EADCC5] transition-colors"
                                style={{ fontFamily: "'Special Elite', monospace", letterSpacing: '0.1em' }}
                            >
                                {g.toUpperCase()}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link to="/write" onClick={() => setMenuOpen(false)} className="text-[#7A2E2E] font-semibold text-sm py-1">✍ Write a Post</Link>
                                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm py-1">My Profile</Link>
                                <Link to="/bookmarks" onClick={() => setMenuOpen(false)} className="text-sm py-1">Bookmarks</Link>
                                <button onClick={handleLogout} className="text-left text-sm py-1 text-[#8B5A2B]">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm py-1">Sign In</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="stamp-btn text-xs text-center mt-2">Subscribe</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}