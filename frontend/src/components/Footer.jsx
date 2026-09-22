import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#141311] text-[#FAF6EE] mt-auto border-t border-[#282521]">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10">
        
        {/* Editorial Masthead Section */}
        <div className="text-center pb-8 border-b border-[#282521]">
          <Link to="/" className="inline-block group">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#FAF6EE] tracking-tight group-hover:text-[#A67C48] transition-colors">
              IDEAPAD
            </h2>
          </Link>
          <p className="text-xs tracking-[0.28em] text-[#A67C48] mt-2 uppercase font-mono">
            A place for ideas worth publishing.
          </p>
          <div className="w-16 h-px bg-[var(--accent-primary)] mx-auto mt-4"></div>
        </div>

        {/* 3-Column Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-b border-[#282521] text-xs font-mono">
          
          {/* Explore Column */}
          <div>
            <h3 className="tracking-[0.2em] uppercase text-[#A67C48] mb-4 pb-1.5 border-b border-[#282521] font-semibold">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/write" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Write Article
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Saved Articles
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Author Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="tracking-[0.2em] uppercase text-[#A67C48] mb-4 pb-1.5 border-b border-[#282521] font-semibold">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> About IDEAPAD
                </a>
              </li>
              <li>
                <a href="mailto:editor@ideapad.press" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Contact Us
                </a>
              </li>
              <li>
                <Link to="/#authors-section" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Writers &amp; Authors
                </Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">›</span> Source Code
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="tracking-[0.2em] uppercase text-[#A67C48] mb-4 pb-1.5 border-b border-[#282521] font-semibold">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2 cursor-pointer">
                  <span className="text-[var(--accent-primary)]">›</span> Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2 cursor-pointer">
                  <span className="text-[var(--accent-primary)]">›</span> Terms of Service
                </span>
              </li>
              <li>
                <span className="text-[#A89F93] hover:text-[#FAF6EE] transition-colors flex items-center gap-2 cursor-pointer">
                  <span className="text-[var(--accent-primary)]">›</span> Community Guidelines
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Colophon & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E857B] font-mono">
          <div>
            © {year} IDEAPAD — All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#6E665D]">
            <span>Vol. 1</span>
            <span>·</span>
            <span>Issue 142</span>
            <span>·</span>
            <span>Independent Publishing Platform</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
