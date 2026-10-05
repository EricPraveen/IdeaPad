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
  const [fontSizeLevel, setFontSizeLevel] = useState(1) // 0: standard, 1: comfortable, 2: large
  const contentRef = useRef(null)

  useEffect(() => {
    loadPost()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Track reading progress
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
        } catch (e) {
          // Like status unavailable or unauthenticated
          void e
        }
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
    if (!window.confirm('Are you sure you want to delete this article?')) return
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  // Parse headings for table of contents and inject drop cap
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

    let contentHtml = doc.body.innerHTML

    // Add drop cap to opening paragraph
    contentHtml = contentHtml.replace(
      /^(<p[^>]*>)?([A-Za-z])/,
      (match, pTag, letter) => `${pTag || '<p>'}<span class="drop-cap-letter">${letter}</span>`
    )

    return { processedHtml: contentHtml, tocItems: toc }
  }, [post])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
        <div className="w-8 h-8 border-2 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-3"></div>
        <p className="font-mono text-xs text-[#8E857B]">Loading article…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <span className="text-4xl block mb-3 opacity-50">📰</span>
        <h2 className="font-serif font-black text-2xl text-[#161412] mb-2">
          Article not found
        </h2>
        <p className="text-sm font-body text-[#5C554D] mb-6">
          This article may have been deleted or removed.
        </p>
        <Link to="/" className="editorial-btn-primary text-xs">
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
    'text-base leading-[1.8]',
    'text-lg leading-[1.9]',
    'text-xl leading-[2.0]'
  ]

  return (
    <div className="relative" ref={contentRef}>
      
      {/* ─── READING PROGRESS INDICATOR ─────────────────────── */}
      <div id="reading-progress" style={{ width: `${readProgress}%` }}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-3 border-b border-[#DDD2C1]">
          <Link
            to="/"
            className="text-xs font-mono text-[#6E665D] hover:text-[#7A1C2E] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            ← FRONT PAGE
          </Link>
          <div className="flex items-center gap-3">
            <span className={getGenreColor(post.genre)}>
              {post.genre || 'Article'}
            </span>
            <span className="text-xs font-mono text-[#8E857B]">
              {mins} MIN READ
            </span>
          </div>
        </div>

        {/* ─── EDITORIAL ARTICLE HEADER ───────────────────────── */}
        <header className="max-w-3xl mx-auto text-center mb-10">
          
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#7A1C2E] font-semibold block mb-3">
            {post.genre ? post.genre.toUpperCase() : 'ARTICLE'}
          </span>

          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#161412] leading-[1.14] mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Author Byline and Reading Controls */}
          <div className="flex items-center justify-center gap-5 flex-wrap text-sm text-[#35312C] pb-6 border-b border-[#DDD2C1]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-sm text-[#7A1C2E]">
                {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left">
                {post.isAnonymous ? (
                  <span className="font-mono text-xs uppercase text-[#161412] block">By Anonymous</span>
                ) : (
                  <Link
                    to={`/user/${post.authorId}`}
                    className="font-mono text-xs uppercase font-bold text-[#161412] hover:text-[#7A1C2E] transition-colors block"
                  >
                    By {post.authorName}
                  </Link>
                )}
                <div className="text-[10px] text-[#8E857B] font-mono">
                  {dateStr}
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#DDD2C1]"></div>

            {/* Type Size Controls */}
            <div className="flex items-center gap-1 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs px-2 py-1 text-xs font-mono text-[#6E665D]">
              <span className="text-[10px] mr-1">TYPE:</span>
              <button
                onClick={() => setFontSizeLevel(0)}
                className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${fontSizeLevel === 0 ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]' : 'hover:text-[var(--accent-primary)]'}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel(1)}
                className={`px-1.5 py-0.5 rounded-xs text-sm cursor-pointer ${fontSizeLevel === 1 ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]' : 'hover:text-[var(--accent-primary)]'}`}
                title="Comfortable text"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel(2)}
                className={`px-1.5 py-0.5 rounded-xs text-base cursor-pointer ${fontSizeLevel === 2 ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]' : 'hover:text-[var(--accent-primary)]'}`}
                title="Large text"
              >
                A++
              </button>
            </div>
          </div>
        </header>

        {/* ─── COVER PHOTOGRAPH PLATE ─────────────────────────── */}
        {post.coverImage && (
          <figure className="max-w-4xl mx-auto mb-12">
            <div className="aspect-[16/9] sm:aspect-[21/9] max-h-[460px] overflow-hidden border border-[#DDD2C1] bg-[#141311]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="editorial-caption text-center mt-2.5 text-xs font-mono text-[#8E857B] italic">
              {post.title}
            </figcaption>
          </figure>
        )}

        {/* ─── MAIN READING BODY & INTERACTIVE DOCK ────────────── */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Table of Contents Sticky Rail */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-5">
              
              {tocItems.length > 0 && (
                <div className="p-4 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-[#7A1C2E] mb-2.5 pb-1.5 border-b border-[#DDD2C1]">
                    Table of Contents
                  </h4>
                  <nav className="space-y-1.5 text-xs font-body">
                    {tocItems.map(item => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-[#6E665D] hover:text-[#7A1C2E] transition-colors leading-snug ${
                          item.level === 'h3' ? 'pl-2 text-[11px]' : 'font-medium'
                        }`}
                      >
                        • {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Article Metrics Tile */}
              <div className="p-3.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-center">
                <div className="text-[10px] font-mono text-[#8E857B] uppercase tracking-wider">
                  ARTICLE STATS
                </div>
                <div className="font-serif font-black text-2xl text-[#161412] my-1">
                  {mins} min
                </div>
                <div className="text-[11px] font-mono text-[#7A1C2E]">
                  {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </div>
              </div>

            </div>
          </aside>

          {/* Central Narrow Long-form Body */}
          <article className="lg:col-span-7">
            <div
              className={`vintage-prose ${fontSizeClasses[fontSizeLevel]} font-body text-[#26221E]`}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* End of article printer's mark */}
            <div className="flex items-center justify-center gap-3 my-12 text-[#A67C48]">
              <div className="h-px w-16 bg-[#DDD2C1]"></div>
              <span className="font-serif font-bold text-xl">❦</span>
              <div className="h-px w-16 bg-[#DDD2C1]"></div>
            </div>

            {/* About the Author Box */}
            {!post.isAnonymous && (
              <div className="p-6 sm:p-7 mb-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-14 h-14 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-xl text-[#7A1C2E] shrink-0">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7A1C2E] font-semibold">
                    ABOUT THE AUTHOR
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#161412] mt-0.5 mb-1.5">
                    {post.authorName}
                  </h3>
                  <p className="font-body text-xs text-[#5C554D] leading-relaxed mb-3">
                    Writer on IDEAPAD, covering {post.genre || 'ideas and stories'}.
                  </p>
                  <Link
                    to={`/user/${post.authorId}`}
                    className="editorial-btn-secondary text-xs py-1 px-3 inline-flex items-center gap-1"
                  >
                    View Writer Profile →
                  </Link>
                </div>
              </div>
            )}

            {/* Author Management Row */}
            {isAuthor && (
              <div className="p-3.5 bg-[#EFE8DC] border border-[#DDD2C1] rounded-xs flex items-center justify-between mb-8">
                <span className="font-mono text-xs text-[#8E857B]">Author Privileges:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/write?edit=${post.id}`)}
                    className="editorial-btn-secondary text-xs py-1 px-3 cursor-pointer"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={handleDelete}
                    className="editorial-btn-primary text-xs py-1 px-3 cursor-pointer"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </article>

          {/* Sticky Reader Action Panel (Right Rail) */}
          <aside className="lg:col-span-2">
            <div className="sticky top-20 flex flex-row lg:flex-col items-center justify-center gap-2.5 p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
              
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`w-full py-2 px-3 rounded-xs flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer border ${
                  liked
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] border-[var(--border-focus)]'
                    : 'bg-[#EFE8DC] text-[#161412] border-[#DDD2C1] hover:bg-[#E2D6C3]'
                }`}
                title="Like article"
              >
                <span>{liked ? '♥' : '♡'}</span>
                <span>{likeCount}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`w-full py-2 px-3 rounded-xs flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer border ${
                  bookmarked
                    ? 'bg-[var(--accent-secondary)] text-[var(--text-on-accent)] border-[var(--accent-secondary)]'
                    : 'bg-[#EFE8DC] text-[#161412] border-[#DDD2C1] hover:bg-[#E2D6C3]'
                }`}
                title="Save bookmark"
              >
                <span>🔖</span>
                <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
              </button>

              {/* Share Link */}
              <button
                onClick={handleShare}
                className="w-full py-2 px-3 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] text-[#161412] hover:bg-[#E2D6C3] flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer"
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
