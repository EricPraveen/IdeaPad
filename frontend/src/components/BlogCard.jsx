import { Link, useNavigate } from 'react-router-dom'
import { getGenreColor } from '../utils/genreColors'
import { useAuth } from '../context/AuthContext'
import { deletePost } from '../services/postService'

function readingTime(content) {
  const text = content?.replace(/<[^>]+>/g, '') || ''
  const words = text.split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

export default function BlogCard({ post, onDelete, isOwner, variant = 'standard' }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!post) return null

  const isAuthor = isOwner || (user && (
    (user.email && post.authorEmail && user.email === post.authorEmail) ||
    (user.id != null && post.authorId != null && String(user.id) === String(post.authorId))
  ))

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Archive and remove this dispatch from IdeaPad?')) return
    try {
      await deletePost(post.id)
      if (onDelete) onDelete(post.id)
    } catch (err) {
      console.error(err)
    }
  }

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  const plainText = post.content?.replace(/<[^>]+>/g, '') || ''
  const excerpt = plainText.length > 150 ? plainText.slice(0, 150) + '…' : plainText

  // ─── HERO VARIANT ─────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <article className="paper-card overflow-hidden p-6 lg:p-8 transition-all duration-300 group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Cover image if available */}
          {post.coverImage && (
            <div className="lg:col-span-7 editorial-frame aspect-[16/10] overflow-hidden">
              <Link to={`/post/${post.id}`}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          )}

          {/* Editorial Content */}
          <div className={`${post.coverImage ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className={getGenreColor(post.genre)}>
                  {post.genre || 'Dispatch'}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#C5A059] px-2 py-0.5 border border-[#C5A059] rounded">
                  ★ Lead Story
                </span>
              </div>

              <Link to={`/post/${post.id}`}>
                <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors leading-tight mb-3 ink-link">
                  {post.title}
                </h2>
              </Link>

              <p className="font-body text-[#3A3530] text-sm sm:text-base leading-relaxed mb-5">
                {plainText.length > 220 ? plainText.slice(0, 220) + '…' : plainText}
              </p>
            </div>

            <div className="pt-4 border-t border-[#DDD2C1] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-xs text-[#7A1C2E]">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  {post.isAnonymous ? (
                    <span className="byline">Anonymous</span>
                  ) : (
                    <Link to={`/user/${post.authorId}`} className="byline text-[#1A1A1A] hover:text-[#7A1C2E] font-semibold transition-colors">
                      {post.authorName}
                    </Link>
                  )}
                  <div className="text-[11px] text-[#8F8679] font-mono">
                    {dateStr} · {readingTime(post.content)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#8F8679] mr-1">
                  ♥ {post.likeCount || 0}
                </span>
                <Link to={`/post/${post.id}`} className="ink-btn text-xs py-1.5 px-3">
                  Read Lead Story →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </article>
    )
  }

  // ─── COMPACT VARIANT (for trending lists) ──────────────────
  if (variant === 'compact') {
    return (
      <article className="paper-card p-4 transition-all duration-300 group flex items-start gap-4">
        {post.coverImage && (
          <div className="w-24 h-24 shrink-0 editorial-frame overflow-hidden">
            <Link to={`/post/${post.id}`}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={getGenreColor(post.genre)}>
              {post.genre || 'Dispatch'}
            </span>
            <span className="text-[10px] font-mono text-[#8F8679]">
              {readingTime(post.content)}
            </span>
          </div>
          <Link to={`/post/${post.id}`}>
            <h3 className="font-serif font-bold text-base text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors leading-snug line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center justify-between text-xs text-[#8F8679] font-mono">
            <span>By {post.isAnonymous ? 'Anonymous' : post.authorName}</span>
            <span>♥ {post.likeCount || 0}</span>
          </div>
        </div>
      </article>
    )
  }

  // ─── STANDARD VARIANT ─────────────────────────────────────
  return (
    <article className="paper-card overflow-hidden flex flex-col justify-between group transition-all duration-300">
      <div>
        {/* Cover Photo */}
        {post.coverImage && (
          <div className="editorial-frame aspect-[16/9] overflow-hidden border-b border-[#DDD2C1]">
            <Link to={`/post/${post.id}`}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        )}

        <div className="p-5">
          {/* Header Tag Row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={getGenreColor(post.genre)}>
              {post.genre || 'Dispatch'}
            </span>
            {post.isFeatured && (
              <span className="text-[10px] uppercase font-mono text-[#7A1C2E] border border-[#7A1C2E] px-1.5 py-0.5 rounded">
                ★ Editor's Pick
              </span>
            )}
          </div>

          {/* Headline */}
          <Link to={`/post/${post.id}`}>
            <h3 className="font-serif font-bold text-xl text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors leading-snug mb-2.5">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="font-body text-[#3A3530] text-sm leading-relaxed mb-4">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-[#DDD2C1] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-xs text-[#7A1C2E] shrink-0">
            {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-xs">
            {post.isAnonymous ? (
              <span className="byline">Anonymous</span>
            ) : (
              <Link to={`/user/${post.authorId}`} className="byline text-[#1A1A1A] hover:text-[#7A1C2E] transition-colors font-medium">
                {post.authorName}
              </Link>
            )}
            <div className="text-[10px] text-[#8F8679] font-mono">
              {dateStr} · {readingTime(post.content)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthor && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/write?edit=${post.id}`)
                }}
                className="text-[11px] font-mono text-[#8F8679] hover:text-[#7A1C2E] transition-colors px-1"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-[11px] font-mono text-[#7A1C2E] hover:underline px-1"
              >
                Delete
              </button>
            </>
          )}
          <Link
            to={`/post/${post.id}`}
            className="ink-btn text-[11px] py-1 px-3"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
