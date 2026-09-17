import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
    const contentRef = useRef(null)

    useEffect(() => {
        loadPost()
    }, [id])

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const el = contentRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const total = el.offsetHeight - window.innerHeight
            const scrolled = Math.max(0, -rect.top)
            const pct = Math.min(100, Math.round((scrolled / total) * 100))
            setReadProgress(pct)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [post])

    const loadPost = async () => {
        try {
            const data = await getPostById(id)
            setPost(data)
            setLikeCount(data.likeCount)
            if (user) {
                try {
                    const likeRes = await axios.get(`http://localhost:8080/api/posts/${id}/like-status`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    setLiked(likeRes.data)
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
            setLikeCount(liked ? likeCount - 1 : likeCount + 1)
        } catch (err) { console.error(err) }
    }

    const handleBookmark = async () => {
        if (!user) return navigate('/login')
        try {
            await toggleBookmark(id)
            setBookmarked(!bookmarked)
        } catch (err) { console.error(err) }
    }

    const handleDelete = async () => {
        if (!window.confirm('Remove this article from the archive?')) return
        try {
            await axios.delete(`http://localhost:8080/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            navigate('/')
        } catch (err) { console.error(err) }
    }

    if (loading) return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center py-24">
                <div className="ink-spinner mb-4"></div>
                <p className="typewriter-text text-[#8B5A2B] text-sm">Turning the pages…</p>
            </div>
            <Footer />
        </div>
    )

    if (!post) return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
                <p className="text-5xl mb-4">📰</p>
                <h2 className="text-2xl font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Article not found
                </h2>
                <Link to="/" className="ink-btn-ghost mt-6 text-sm">← Back to Archive</Link>
            </div>
            <Footer />
        </div>
    )

    const dateStr = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : ''

    const mins = readingTime(post.content)
    const isAuthor = user && (
        (user.email && post.authorEmail && user.email === post.authorEmail) ||
        (user.id && post.authorId && user.id === post.authorId)
    )

    // Add drop cap to content HTML
    const contentWithDropCap = post.content?.replace(
        /^(<[^>]+>)*([A-Za-z])/,
        (match, tags, letter) => `${tags || ''}<span class="drop-cap-letter">${letter}</span>`
    ) || post.content

    return (
        <div className="flex flex-col min-h-screen" ref={contentRef}>
            {/* Reading progress bar */}
            <div id="reading-progress" style={{ width: `${readProgress}%` }}></div>

            <Navbar />

            <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 w-full">
                <article className="fade-in">
                    {/* Back link */}
                    <Link
                        to="/"
                        className="byline text-[#8B5A2B] hover:text-[#7A2E2E] transition-colors flex items-center gap-1 mb-6 text-xs"
                    >
                        ← Return to Archive
                    </Link>

                    {/* Genre tag */}
                    <span className={getGenreColor(post.genre)}>
                        {post.genre || 'Essay'}
                    </span>

                    {/* Double rule */}
                    <div className="vintage-rule-double mt-4 mb-5"></div>

                    {/* Title */}
                    <h1
                        className="text-3xl md:text-5xl font-black text-[#1F1B16] leading-tight mb-5"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {post.title}
                    </h1>

                    {/* Byline row */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 pb-5 border-b border-[#C8B89A]">
                        <div>
                            {post.isAnonymous ? (
                                <span className="byline">By Anonymous</span>
                            ) : (
                                <Link to={`/user/${post.authorId}`} className="byline hover:text-[#7A2E2E] transition-colors">
                                    By {post.authorName}
                                </Link>
                            )}
                        </div>
                        {dateStr && (
                            <span className="typewriter-text text-[#8B5A2B] text-xs opacity-75">
                                {dateStr}
                            </span>
                        )}
                        <span className="typewriter-text text-[#8B5A2B] text-xs opacity-75">
                            {mins} min read
                        </span>
                    </div>

                    {/* Cover image — editorial */}
                    {post.coverImage && (
                        <figure className="mb-8">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-[360px] object-cover editorial-img"
                            />
                            <figcaption
                                className="text-center text-xs text-[#8B5A2B] mt-2 italic"
                                style={{ fontFamily: "'Special Elite', monospace" }}
                            >
                                {post.title}
                            </figcaption>
                        </figure>
                    )}

                    {/* Article content — vintage prose with drop cap */}
                    <div
                        className="vintage-prose"
                        style={{ position: 'relative' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Actions row */}
                    <div className="vintage-rule-double my-8"></div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleLike}
                            className={`stamp-btn text-xs flex items-center gap-2 ${liked ? 'bg-[#7A2E2E]' : 'bg-[#1F1B16]'}`}
                        >
                            <span>{liked ? '♥' : '♡'}</span>
                            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                        </button>

                        <button
                            onClick={handleBookmark}
                            className={`ink-btn-ghost text-xs flex items-center gap-2 ${bookmarked ? 'bg-[#8B5A2B] text-[#FAF6EE]' : ''}`}
                        >
                            {bookmarked ? '🔖 Saved' : '🔖 Save to Library'}
                        </button>

                        {isAuthor && (
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={() => navigate(`/write?edit=${post.id}`)}
                                    className="ink-btn-ghost text-xs"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="stamp-btn text-xs"
                                    style={{ background: '#5C1F1F' }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Author card */}
                    {!post.isAnonymous && (
                        <div className="mt-10 paper-card p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-[#8B5A2B] flex items-center justify-center bg-[#EADCC5] shrink-0">
                                <span className="text-[#7A2E2E] text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {post.authorName?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                            <div>
                                <p className="section-header mb-1">About the Author</p>
                                <Link
                                    to={`/user/${post.authorId}`}
                                    className="font-bold text-[#1F1B16] hover:text-[#7A2E2E] transition-colors"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {post.authorName}
                                </Link>
                                <p className="text-sm text-[#8B5A2B] mt-1">
                                    View all articles by this correspondent →
                                </p>
                            </div>
                        </div>
                    )}
                </article>
            </main>

            <Footer />
        </div>
    )
}