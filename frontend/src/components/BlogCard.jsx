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
    if (!window.confirm('Are you sure you want to delete this article?')) return
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

  // ─── HERO BROADSHEET VARIANT ──────────────────────────────────
  if (variant === 'hero') {
    return (
      <article className="bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs p-6 sm:p-8 transition-all duration-200 group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Cover photograph plate */}
          {post.coverImage && (
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden border border-[#DDD2C1] bg-[#141311]">
              <Link to={`/post/${post.id}`}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                />
              </Link>
            </div>
          )}

          {/* Lead Editorial Copy */}
          <div className={`${post.coverImage ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className={getGenreColor(post.genre)}>
                  {post.genre || 'Article'}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#A67C48] px-2 py-0.5 border border-[#C5A059] rounded-xs">
                  ★ Lead Story
                </span>
              </div>

              <Link to={`/post/${post.id}`}>
                <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#161412] group-hover:text-[#7A1C2E] transition-colors leading-[1.2] mb-3">
                  {post.title}
                </h2>
              </Link>

              <p className="font-body text-[#35312C] text-sm sm:text-base leading-relaxed mb-6">
                {plainText.length > 220 ? plainText.slice(0, 220) + '…' : plainText}
              </p>
            </div>

            <div className="pt-4 border-t border-[#DDD2C1] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-xs text-[#7A1C2E]">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  {post.isAnonymous ? (
                    <span className="text-xs font-mono uppercase text-[#161412]">By Anonymous</span>
                  ) : (
                    <Link to={`/user/${post.authorId}`} className="text-xs font-mono uppercase font-bold text-[#161412] hover:text-[#7A1C2E] transition-colors">
                      By {post.authorName}
                    </Link>
                  )}
                  <div className="text-[10px] text-[#8E857B] font-mono">
                    {dateStr} · {readingTime(post.content)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#8E857B]">
                  ♥ {post.likeCount || 0}
                </span>
                <Link to={`/post/${post.id}`} className="editorial-btn-primary text-xs py-1.5 px-3.5">
                  Read Article →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </article>
    )
  }

  // ─── COMPACT COLUMN VARIANT (Newspaper vertical column) ──────
  if (variant === 'compact') {
    return (
      <article className="p-4 border-b border-[#DDD2C1] last:border-b-0 hover:bg-[#FAF6EE] transition-colors group">
        <div className="flex items-center gap-2 mb-2">
          <span className={getGenreColor(post.genre)}>
            {post.genre || 'Article'}
          </span>
          <span className="text-[10px] font-mono text-[#8E857B]">
            {readingTime(post.content)}
          </span>
        </div>
        <Link to={`/post/${post.id}`}>
          <h3 className="font-serif font-bold text-base text-[#161412] group-hover:text-[#7A1C2E] transition-colors leading-snug line-clamp-2 mb-1.5">
            {post.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-[11px] text-[#8E857B] font-mono mt-2 pt-2 border-t border-[#EFE8DC]">
          <span className="truncate max-w-[150px]">By {post.isAnonymous ? 'Anonymous' : post.authorName}</span>
          <span>♥ {post.likeCount || 0}</span>
        </div>
      </article>
    )
  }

  // ─── STANDARD EDITORIAL DISPATCH CARD ────────────────────────
  return (
    <article className="bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs overflow-hidden flex flex-col justify-between group transition-all duration-200">
      <div>
        {/* Cover Photo Plate */}
        {post.coverImage && (
          <div className="aspect-[16/9] overflow-hidden border-b border-[#DDD2C1] bg-[#141311]">
            <Link to={`/post/${post.id}`}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
              />
            </Link>
          </div>
        )}

        <div className="p-5">
          {/* Category tag & featured indicator */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={getGenreColor(post.genre)}>
              {post.genre || 'Article'}
            </span>
            {post.isFeatured && (
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#7A1C2E] border border-[#7A1C2E] px-1.5 py-0.5 rounded-xs">
                ★ Editor's Pick
              </span>
            )}
          </div>

          {/* Headline */}
          <Link to={`/post/${post.id}`}>
            <h3 className="font-serif font-bold text-xl text-[#161412] group-hover:text-[#7A1C2E] transition-colors leading-snug mb-2.5">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="font-body text-[#35312C] text-sm leading-relaxed mb-4">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer Byline */}
      <div className="px-5 pb-5 pt-3 border-t border-[#DDD2C1] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-xs text-[#7A1C2E] shrink-0">
            {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-xs">
            {post.isAnonymous ? (
              <span className="font-mono text-[11px] uppercase text-[#161412]">Anonymous</span>
            ) : (
              <Link to={`/user/${post.authorId}`} className="font-mono text-[11px] uppercase font-bold text-[#161412] hover:text-[#7A1C2E] transition-colors">
                {post.authorName}
              </Link>
            )}
            <div className="text-[10px] text-[#8E857B] font-mono">
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
                className="text-[10px] font-mono uppercase tracking-wider text-[#8E857B] hover:text-[#7A1C2E] transition-colors px-1 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-[10px] font-mono uppercase tracking-wider text-[#7A1C2E] hover:underline px-1 cursor-pointer"
              >
                Delete
              </button>
            </>
          )}
          <Link
            to={`/post/${post.id}`}
            className="editorial-btn-neutral text-[10px] py-1 px-3"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
