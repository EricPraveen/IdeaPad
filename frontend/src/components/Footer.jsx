import { useState } from 'react'
import { Link } from 'react-router-dom'

const footerGenres = ['Technology', 'Travel', 'Lifestyle', 'Fiction', 'Opinion', 'Culture', 'Health', 'Finance']

export default function Footer() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) { setSubscribed(true); setEmail('') }
    }

    const year = new Date().getFullYear()

    return (
        <footer style={{ background: '#1F1B16', color: '#EADCC5', fontFamily: "'IBM Plex Serif', serif" }}>
            {/* Top double rule */}
            <div style={{ borderTop: '4px double #8B5A2B' }}></div>

            <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
                {/* Masthead in footer */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-[#F5EAD7]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        IdeaPad
                    </h2>
                    <p className="text-xs tracking-[0.3em] text-[#B08968] mt-1 uppercase" style={{ fontFamily: "'Special Elite', monospace" }}>
                        The Independent Voice of Ideas
                    </p>
                    <div className="flex items-center gap-4 mt-4 max-w-xs mx-auto">
                        <div className="flex-1 h-px bg-[#8B5A2B] opacity-50"></div>
                        <div className="h-1 w-1 rounded-full bg-[#7A2E2E]"></div>
                        <div className="flex-1 h-px bg-[#8B5A2B] opacity-50"></div>
                    </div>
                </div>

                {/* 4-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

                    {/* About */}
                    <div>
                        <h3 className="section-header" style={{ color: '#B08968', borderBottomColor: '#8B5A2B', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em' }}>
                            About
                        </h3>
                        <p className="text-[#B8A98A] text-sm leading-relaxed">
                            IdeaPad is an open editorial platform for writers, thinkers, and storytellers. 
                            Share your ideas with readers across the globe.
                        </p>
                        <div className="mt-4 flex gap-3">
                            {/* Social icons as ink stamps */}
                            {['𝕏', 'in', 'f'].map((icon) => (
                                <span
                                    key={icon}
                                    className="w-8 h-8 flex items-center justify-center border border-[#8B5A2B] text-[#B08968] text-xs hover:bg-[#8B5A2B] hover:text-[#F5EAD7] transition-all"
                                    style={{ fontFamily: "'Special Elite', monospace", cursor: 'pointer' }}
                                >
                                    {icon}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="section-header" style={{ color: '#B08968', borderBottomColor: '#8B5A2B', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em' }}>
                            Categories
                        </h3>
                        <ul className="space-y-2">
                            {footerGenres.map(g => (
                                <li key={g}>
                                    <Link
                                        to={`/?genre=${g}`}
                                        className="text-[#B8A98A] hover:text-[#F5EAD7] text-sm transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-[#7A2E2E]">›</span> {g}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="section-header" style={{ color: '#B08968', borderBottomColor: '#8B5A2B', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em' }}>
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Write a Post', to: '/write' },
                                { label: 'My Profile', to: '/profile' },
                                { label: 'Bookmarks', to: '/bookmarks' },
                                { label: 'Login', to: '/login' },
                                { label: 'Register', to: '/register' },
                            ].map(link => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-[#B8A98A] hover:text-[#F5EAD7] text-sm transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-[#7A2E2E]">›</span> {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="section-header" style={{ color: '#B08968', borderBottomColor: '#8B5A2B', fontFamily: "'Special Elite', monospace", fontSize: '0.65rem', letterSpacing: '0.25em' }}>
                            Newsletter
                        </h3>
                        <p className="text-[#B8A98A] text-sm mb-4">
                            Receive the finest curated stories, delivered to your inbox each week.
                        </p>
                        {subscribed ? (
                            <p className="text-[#B08968] text-sm italic" style={{ fontFamily: "'Special Elite', monospace" }}>
                                ✓ Thank you for subscribing!
                            </p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="ink-input text-sm"
                                    style={{ background: '#2A2520', border: '1px solid #5A4A38', color: '#EADCC5' }}
                                />
                                <button type="submit" className="stamp-btn text-xs">
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom rule + copyright */}
                <div style={{ borderTop: '1px solid #3A3530' }} className="pt-6 text-center">
                    <p
                        className="text-[#8B5A2B] text-xs"
                        style={{ fontFamily: "'Special Elite', monospace", letterSpacing: '0.1em' }}
                    >
                        © {year} IdeaPad — All rights reserved. Printed with ink &amp; intention.
                    </p>
                </div>
            </div>
        </footer>
    )
}
