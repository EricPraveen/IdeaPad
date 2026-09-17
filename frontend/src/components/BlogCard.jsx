import { Link, useNavigate } from 'react-router-dom'
import { getGenreColor } from '../utils/genreColors'
import { useAuth } from '../context/AuthContext'
import { deletePost } from '../services/postService'

// Estimate reading time
function readingTime(content) {
    const text = content?.replace(/<[^>]+>/g, '') || ''
    const words = text.split(/\s+/).filter(Boolean).length
    const mins = Math.max(1, Math.round(words / 200))
    return `${mins} min read`
}

export default function BlogCard({ post, onDelete, isOwner }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const isAuthor = isOwner || (user && (
        (user.email && post.authorEmail && user.email === post.authorEmail) ||
        (user.id != null && post.authorId != null && String(user.id) === String(post.authorId))
    ))

    const handleDelete = async () => {
        if (!window.confirm('Delete this post from the archive?')) return
        try {
            await deletePost(post.id)
            if (onDelete) onDelete(post.id)
        } catch (err) {
            console.error(err)
        }
    }

    const dateStr = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : ''

    const plainText = post.content?.replace(/<[^>]+>/g, '') || ''
    const excerpt = plainText.length > 160 ? plainText.slice(0, 160) + '…' : plainText

    return (
        <article className="paper-card group" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Cover image — editorial polaroid style */}
            {post.coverImage && (
                <div className="overflow-hidden border-b border-[#C8B89A]" style={{ height: '180px' }}>
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover editorial-img group-hover:scale-[1.03] transition-transform duration-700"
                        style={{ filter: 'sepia(0.18) contrast(1.05)' }}
                    />
                </div>
            )}

            <div className="p-5">
                {/* Category + Featured badge row */}
                <div className="flex items-center gap-2 mb-3">
                    <span className={getGenreColor(post.genre)}>
                        {post.genre || 'Essay'}
                    </span>
                    {post.isFeatured && (
                        <span className="genre-label" style={{ color: '#7A2E2E', borderColor: '#7A2E2E', background: '#FBEEEE' }}>
                            ★ Featured
                        </span>
                    )}
                </div>

                {/* Vintage rule */}
                <hr className="vintage-rule" style={{ margin: '0 0 0.75rem 0' }} />

                {/* Headline */}
                <Link to={`/post/${post.id}`}>
                    <h2
                        className="text-xl font-bold text-[#1F1B16] group-hover:text-[#7A2E2E] transition-colors leading-snug mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {post.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-[#4A3F32] text-sm leading-relaxed mb-4" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
                    {excerpt}
                </p>

                {/* Vintage rule */}
                <hr className="vintage-rule" style={{ margin: '0 0 0.75rem 0' }} />

                {/* Byline row */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        {post.isAnonymous ? (
                            <span className="byline">Anonymous</span>
                        ) : (
                            <Link
                                to={`/user/${post.authorId}`}
                                className="byline hover:text-[#7A2E2E] transition-colors"
                            >
                                By {post.authorName}
                            </Link>
                        )}
                        {dateStr && (
                            <span className="text-[#8B5A2B] text-xs opacity-70" style={{ fontFamily: "'Special Elite', monospace" }}>
                                · {dateStr}
                            </span>
                        )}
                        <span className="text-[#8B5A2B] text-xs opacity-70" style={{ fontFamily: "'Special Elite', monospace" }}>
                            · {readingTime(post.content)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {isAuthor && (
                            <button
                                onClick={() => navigate(`/write?edit=${post.id}`)}
                                className="ink-btn-ghost text-xs px-2 py-1"
                                style={{ fontSize: '0.65rem' }}
                            >
                                Edit
                            </button>
                        )}
                        <Link
                            to={`/post/${post.id}`}
                            className="ink-btn text-xs px-3 py-1"
                            style={{ fontSize: '0.65rem' }}
                        >
                            Read →
                        </Link>
                    </div>
                </div>

                {/* Bottom strip — likes + delete */}
                <div className="mt-3 pt-2 border-t border-[#E0D4C0] flex items-center justify-between">
                    <span className="text-xs text-[#8B5A2B]" style={{ fontFamily: "'Special Elite', monospace" }}>
                        ♥ {post.likeCount || 0} likes
                    </span>
                    {isAuthor && (
                        <button
                            onClick={handleDelete}
                            className="text-xs text-[#7A2E2E] hover:underline transition-colors"
                            style={{ fontFamily: "'Special Elite', monospace" }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </article>
    )
}