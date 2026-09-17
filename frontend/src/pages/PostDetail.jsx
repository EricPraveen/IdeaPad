import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPostById } from '../services/postService'
import { toggleBookmark } from '../services/bookmarkService'
import { useAuth } from '../context/AuthContext'
import { getGenreColor } from '../utils/genreColors'
import axios from 'axios'

function readingTime(content) {
  const text = content?.replace(/<[^>]+>/g, '') || ''
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [fontSizeLevel, setFontSizeLevel] = useState(1) // 0: normal, 1: comfortable, 2: large
  const contentRef = useRef(null)

  useEffect(() => {
    loadPost()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0
      setReadProgress(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [post])

  const loadPost = async () => {
    try {
      const data = await getPostById(id)
      setPost(data)
      setLikeCount(data.likeCount || 0)
      if (user) {
        try {
          const likeRes = await axios.get(`http://localhost:8080/api/posts/${id}/like-status`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          setLiked(Boolean(likeRes.data))
        } catch {}
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) return navigate('/login')
    try {
      await axios.post(`http://localhost:8080/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setLiked(!liked)
      setLikeCount(liked ? Math.max(0, likeCount - 1) : likeCount + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleBookmark = async () => {
    if (!user) return navigate('/login')
    try {
      await toggleBookmark(id)
      setBookmarked(!bookmarked)
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this dispatch from the archive?')) return
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  // Parse Headings for Sticky Table of Contents & Inject Drop Cap
  const { processedHtml, tocItems } = useMemo(() => {
    if (!post || !post.content) return { processedHtml: '', tocItems: [] }

    const parser = new DOMParser()
    const doc = parser.parseFromString(post.content, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3')
    const toc = []

    headings.forEach((heading, index) => {
      const headingId = `editorial-sec-${index}`
      heading.id = headingId
      toc.push({
        id: headingId,
        text: heading.textContent || `Section ${index + 1}`,
        level: heading.tagName.toLowerCase()
      })
    })

    // If no headings found, generate intuitive editorial sections if content is long
    let contentHtml = doc.body.innerHTML

    // Add drop-cap to first paragraph letter
    contentHtml = contentHtml.replace(
      /^(<p[^>]*>)?([A-Za-z])/,
      (match, pTag, letter) => `${pTag || '<p>'}<span class="drop-cap-letter">${letter}</span>`
    )

    return { processedHtml: contentHtml, tocItems: toc }
  }, [post])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
        <div className="w-10 h-10 border-3 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-xs text-[#8F8679]">Fetching article from the library press…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <span className="text-5xl block mb-4 opacity-50">📰</span>
        <h2 className="font-serif font-black text-2xl text-[#1A1A1A] mb-2">
          Dispatch not found
        </h2>
        <p className="text-sm font-body text-[#6B6358] mb-6">
          This article may have been archived or removed from the catalog.
        </p>
        <Link to="/" className="stamp-btn text-xs">
          ← Return to Front Page
        </Link>
      </div>
    )
  }

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : ''

  const mins = readingTime(post.content)
  const isAuthor = user && (
    (user.email && post.authorEmail && user.email === post.authorEmail) ||
    (user.id != null && post.authorId != null && String(user.id) === String(post.authorId))
  )

  const fontSizeClasses = [
    'text-base leading-relaxed',
    'text-lg leading-loose',
    'text-xl leading-loose'
  ]

  return (
    <div className="relative" ref={contentRef}>
      
      {/* ─── TOP READING PROGRESS BAR ───────────────────────── */}
      <div id="reading-progress" style={{ width: `${readProgress}%` }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD2C1]">
          <Link
            to="/"
            className="text-xs font-mono text-[#6B6358] hover:text-[#7A1C2E] flex items-center gap-1.5 transition-colors"
          >
            ← FRONT PAGE
          </Link>
          <div className="flex items-center gap-3">
            <span className={getGenreColor(post.genre)}>
              {post.genre || 'Dispatch'}
            </span>
            <span className="text-xs font-mono text-[#8F8679]">
              {mins} MIN READ
            </span>
          </div>
        </div>

        {/* ─── ARTICLE HEADER ───────────────────────────────── */}
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.15] mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Author Byline & Date */}
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-[#3A3530] pb-6 border-b border-[#DDD2C1]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#EFE8DC] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-sm text-[#7A1C2E]">
                {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left">
                {post.isAnonymous ? (
                  <span className="font-mono text-xs uppercase text-[#1A1A1A]">By Anonymous</span>
                ) : (
                  <Link
                    to={`/user/${post.authorId}`}
                    className="font-mono text-xs uppercase font-bold text-[#1A1A1A] hover:text-[#7A1C2E] transition-colors"
                  >
                    By {post.authorName}
                  </Link>
                )}
                <div className="text-[11px] text-[#8F8679] font-mono">
                  {dateStr}
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#DDD2C1]"></div>

            {/* Reading preferences toggle */}
            <div className="flex items-center gap-1 bg-[#FAF6EE] border border-[#DDD2C1] rounded px-2 py-1 text-xs font-mono text-[#6B6358]">
              <span>Font:</span>
              <button
                onClick={() => setFontSizeLevel(0)}
                className={`px-1.5 py-0.5 rounded ${fontSizeLevel === 0 ? 'bg-[#7A1C2E] text-[#FAF6EE]' : 'hover:text-[#7A1C2E]'}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel(1)}
                className={`px-1.5 py-0.5 rounded text-sm ${fontSizeLevel === 1 ? 'bg-[#7A1C2E] text-[#FAF6EE]' : 'hover:text-[#7A1C2E]'}`}
                title="Comfortable text"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel(2)}
                className={`px-1.5 py-0.5 rounded text-base ${fontSizeLevel === 2 ? 'bg-[#7A1C2E] text-[#FAF6EE]' : 'hover:text-[#7A1C2E]'}`}
                title="Large text"
              >
                A++
              </button>
            </div>
          </div>
        </header>

        {/* ─── COVER PHOTOGRAPH ─────────────────────────────── */}
        {post.coverImage && (
          <figure className="max-w-5xl mx-auto mb-10">
            <div className="editorial-frame aspect-[16/9] sm:aspect-[21/9] max-h-[480px]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="editorial-caption">
              Lead plate illustration: {post.title}
            </figcaption>
          </figure>
        )}

        {/* ─── MAIN READING LAYOUT (WITH STICKY TOC) ─────────── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left / Desktop Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              
              {/* Table of Contents card */}
              {tocItems.length > 0 ? (
                <div className="paper-card p-5 bg-[#FAF6EE]">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-[#7A1C2E] mb-3 pb-2 border-b border-[#DDD2C1]">
                    Table of Contents
                  </h4>
                  <nav className="space-y-2 text-xs font-body">
                    {tocItems.map(item => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-[#6B6358] hover:text-[#7A1C2E] transition-colors leading-snug ${
                          item.level === 'h3' ? 'pl-3 text-[11px]' : 'font-medium'
                        }`}
                      >
                        • {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              ) : (
                <div className="paper-card p-4 bg-[#FAF6EE] text-center text-xs font-mono text-[#8F8679]">
                  <span className="block text-base mb-1">📜</span>
                  <span>Complete Long-form Dispatch</span>
                </div>
              )}

              {/* Quick info stamp */}
              <div className="paper-subtle p-4 rounded text-center border border-[#DDD2C1]">
                <div className="text-[10px] font-mono text-[#8F8679] uppercase">DISPATCH METRICS</div>
                <div className="font-serif font-black text-2xl text-[#1A1A1A] my-1">{mins} min</div>
                <div className="text-[11px] font-mono text-[#7A1C2E]">{likeCount} endorsements</div>
              </div>

            </div>
          </aside>

          {/* Central Article Body */}
          <article className="lg:col-span-7">
            <div
              className={`vintage-prose ${fontSizeClasses[fontSizeLevel]}`}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* End of article ornament */}
            <div className="flex items-center justify-center gap-3 my-12 text-[#C5A059]">
              <div className="h-px w-16 bg-[#DDD2C1]"></div>
              <span className="font-serif font-bold text-lg">❦</span>
              <div className="h-px w-16 bg-[#DDD2C1]"></div>
            </div>

            {/* Author Spotlight Box */}
            {!post.isAnonymous && (
              <div className="paper-card p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-[#EFE8DC] border-2 border-[#C5A059] flex items-center justify-center font-serif font-bold text-2xl text-[#7A1C2E] shrink-0">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1C2E]">
                    ABOUT THE CORRESPONDENT
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mt-0.5 mb-2">
                    {post.authorName}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#6B6358] leading-relaxed mb-3">
                    Regular contributor to the IdeaPad Gazette, investigating topics in {post.genre || 'arts and culture'}.
                  </p>
                  <Link
                    to={`/user/${post.authorId}`}
                    className="ink-btn-ghost text-xs py-1 px-3 inline-flex items-center gap-1"
                  >
                    View Writer's Portfolio →
                  </Link>
                </div>
              </div>
            )}

            {/* Author Controls */}
            {isAuthor && (
              <div className="paper-subtle p-4 rounded flex items-center justify-between mb-8 border border-[#DDD2C1]">
                <span className="font-mono text-xs text-[#8F8679]">Author Privileges:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/write?edit=${post.id}`)}
                    className="ink-btn-ghost text-xs py-1 px-3"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={handleDelete}
                    className="stamp-btn text-xs py-1 px-3"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </article>

          {/* Right / Desktop Sticky Action Panel */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 flex flex-row lg:flex-col items-center justify-center gap-3 p-3 paper-card bg-[#FAF6EE]">
              
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`w-full py-2.5 px-3 rounded flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                  liked
                    ? 'bg-[#7A1C2E] text-[#FAF6EE] shadow-sm'
                    : 'bg-[#EFE8DC] text-[#1A1A1A] hover:bg-[#E2D6C3]'
                }`}
                title="Endorse dispatch"
              >
                <span>{liked ? '♥' : '♡'}</span>
                <span>{likeCount}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`w-full py-2.5 px-3 rounded flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                  bookmarked
                    ? 'bg-[#C5A059] text-[#1A1A1A] font-bold shadow-sm'
                    : 'bg-[#EFE8DC] text-[#1A1A1A] hover:bg-[#E2D6C3]'
                }`}
                title="Save to clippings"
              >
                <span>🔖</span>
                <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full py-2.5 px-3 rounded bg-[#EFE8DC] text-[#1A1A1A] hover:bg-[#E2D6C3] flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer"
                title="Copy share link"
              >
                <span>🔗</span>
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
              </button>

            </div>
          </aside>

        </div>

      </div>
    </div>
  )
}
