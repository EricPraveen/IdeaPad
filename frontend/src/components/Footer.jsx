import { useState } from 'react'
import { Link } from 'react-router-dom'

const footerGenres = ['Technology', 'Travel', 'Lifestyle', 'Fiction', 'Opinion', 'Culture', 'Health', 'Finance']

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A1A] text-[#FAF6EE] mt-auto border-t-4 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        
        {/* Masthead header in footer */}
        <div className="text-center mb-10 pb-8 border-b border-[#3A3530]">
          <h2 className="text-4xl sm:text-5xl font-black text-[#FAF6EE] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            IdeaPad
          </h2>
          <p className="text-xs tracking-[0.35em] text-[#C5A059] mt-2 uppercase font-mono">
            The Independent Voice of Ideas · Devoted to the Written Word
          </p>
        </div>

        {/* 4-column editorial directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-sm font-body">
          
          {/* About */}
          <div>
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-1 border-b border-[#3A3530]">
              The Press
            </h3>
            <p className="text-[#C8B89A] leading-relaxed text-xs sm:text-sm">
              An independent literary forum and publishing house for critical thought, long-form journalism, personal essays, and fiction.
            </p>
            <div className="mt-4 flex gap-2">
              {['𝕏', 'in', 'gh', 'm'].map((net) => (
                <span
                  key={net}
                  className="w-8 h-8 rounded border border-[#3A3530] text-[#C5A059] hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#1A1A1A] flex items-center justify-center font-mono text-xs transition-colors cursor-pointer"
                >
                  {net}
                </span>
              ))}
            </div>
          </div>

          {/* Desks */}
          <div>
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-1 border-b border-[#3A3530]">
              Departments
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {footerGenres.map(g => (
                <li key={g}>
                  <Link
                    to={`/?genre=${g}`}
                    className="text-[#C8B89A] hover:text-[#FAF6EE] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#7A1C2E] group-hover:translate-x-0.5 transition-transform">›</span> {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-1 border-b border-[#3A3530]">
              Gazette Index
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {[
                { label: 'Front Page', to: '/' },
                { label: 'Write Dispatch', to: '/write' },
                { label: 'Archive Search', to: '/?q=' },
                { label: 'Saved Clippings', to: '/bookmarks' },
                { label: 'Sign In', to: '/login' },
                { label: 'Register Account', to: '/register' },
              ].map(item => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[#C8B89A] hover:text-[#FAF6EE] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#7A1C2E] group-hover:translate-x-0.5 transition-transform">›</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gazette Dispatch Subscription */}
          <div>
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#C5A059] mb-3 pb-1 border-b border-[#3A3530]">
              Weekly Dispatch
            </h3>
            <p className="text-[#C8B89A] text-xs leading-relaxed mb-3">
              Curated Sunday editions delivered straight to your personal desk.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#24201C] border border-[#C5A059] rounded text-xs text-[#C5A059] font-mono">
                ✓ You are enrolled in the Weekly Dispatch.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correspondent@post.com"
                  required
                  className="px-3 py-2 bg-[#26221D] border border-[#3A3530] text-[#FAF6EE] placeholder:text-[#6B6358] placeholder:font-mono rounded text-xs focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="stamp-btn text-xs py-2"
                >
                  Enroll
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Colophon & Copyright */}
        <div className="pt-6 border-t border-[#3A3530] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8F8679] font-mono">
          <div>
            © {year} IdeaPad Gazette. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Vol. I</span>
            <span>·</span>
            <span>Issue 142</span>
            <span>·</span>
            <span>Printed with Ink &amp; Intention</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
