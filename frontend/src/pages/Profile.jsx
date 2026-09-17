import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { useAuth } from '../context/AuthContext'
import { getPostsByUserId, getDrafts, publishPost, deletePost } from '../services/postService'

export default function Profile() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [drafts, setDrafts] = useState([])
    const [activeTab, setActiveTab] = useState('published')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        } else {
            const token = localStorage.getItem('token')
            if (!token) { navigate('/login'); return }
            loadPosts()
            loadDrafts()
        }
    }, [user, navigate])

    const loadPosts = async () => {
        try {
            const response = await getPostsByUserId(user.id)
            setPosts(response)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadDrafts = async () => {
        try {
            const data = await getDrafts()
            setDrafts(data)
        } catch (err) {
            console.error('Error loading drafts:', err)
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login')
            }
        }
    }

    const handlePublish = async (id) => {
        try {
            const published = drafts.find(d => d.id === id)
            await publishPost(id, published)
            setDrafts(drafts.filter(d => d.id !== id))
            if (published) setPosts([...posts, { ...published, status: 'published' }])
            alert('Post published successfully!')
        } catch (err) {
            console.error(err)
            alert('Failed to publish: ' + err.message)
        }
    }

    const handleDeleteDraft = async (id) => {
        if (!window.confirm('Delete this draft from the archives?')) return
        try {
            await deletePost(id)
            setDrafts(drafts.filter(d => d.id !== id))
        } catch (err) { console.error(err) }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-10 w-full">

                {/* Author Card */}
                <div className="paper-card p-6 mb-8">
                    <div className="flex items-start gap-5">
                        <div
                            className="w-16 h-16 rounded-full border-2 border-[#8B5A2B] flex items-center justify-center shrink-0"
                            style={{ background: '#EADCC5' }}
                        >
                            <span
                                className="text-2xl font-bold text-[#7A2E2E]"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h1
                                className="text-2xl font-black text-[#1F1B16]"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {user?.name}
                            </h1>
                            <p className="byline mt-0.5">@{user?.username || user?.email}</p>
                            {user?.bio && (
                                <p className="text-[#4A3F32] text-sm mt-2 leading-relaxed" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
                                    {user.bio}
                                </p>
                            )}
                            {user?.country && (
                                <p className="typewriter-text text-[#8B5A2B] text-xs mt-1">
                                    📍 {user.country}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/edit-profile')}
                            className="ink-btn-ghost text-xs shrink-0"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="flex gap-3 mb-6">
                    {['published', 'drafts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="genre-label transition-all"
                            style={{
                                fontFamily: "'Special Elite', monospace",
                                color: activeTab === tab ? '#FAF6EE' : '#8B5A2B',
                                background: activeTab === tab ? '#7A2E2E' : 'transparent',
                                borderColor: activeTab === tab ? '#7A2E2E' : '#8B5A2B',
                                padding: '0.35rem 1rem',
                            }}
                        >
                            {tab === 'published'
                                ? `PUBLISHED (${posts.length})`
                                : `DRAFTS (${drafts.length})`
                            }
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="ink-spinner mb-4"></div>
                        <p className="typewriter-text text-[#8B5A2B] text-sm">Retrieving your dispatches…</p>
                    </div>
                ) : activeTab === 'published' ? (
                    posts.length === 0 ? (
                        <div className="paper-card text-center py-20 flex flex-col items-center">
                            <p className="text-4xl mb-4 opacity-30">✒️</p>
                            <h3 className="text-lg font-bold text-[#1F1B16] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                No published articles yet
                            </h3>
                            <p className="typewriter-text text-[#8B5A2B] text-xs mb-5">The press awaits your first dispatch.</p>
                            <button onClick={() => navigate('/write')} className="stamp-btn text-xs">
                                Write First Article
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {posts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    isOwner={true}
                                    onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    drafts.length === 0 ? (
                        <div className="paper-card text-center py-20">
                            <p className="typewriter-text text-[#8B5A2B] text-sm">No drafts in the archive.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {drafts.map(draft => (
                                <div key={draft.id} className="paper-card p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="genre-label" style={{ color: '#B08968', borderColor: '#B08968' }}>
                                            DRAFT
                                        </span>
                                        <span className="typewriter-text text-[#8B5A2B] text-xs">{draft.genre}</span>
                                    </div>
                                    <h2
                                        className="text-lg font-bold text-[#1F1B16] mb-2"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {draft.title || 'Untitled'}
                                    </h2>
                                    <p className="text-[#4A3F32] text-sm mb-4 line-clamp-2">
                                        {draft.content?.replace(/<[^>]+>/g, '')}
                                    </p>
                                    <hr className="vintage-rule mb-3" />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/write?edit=${draft.id}`)}
                                            className="ink-btn-ghost text-xs px-3 py-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handlePublish(draft.id)}
                                            className="ink-btn text-xs px-3 py-1"
                                        >
                                            Publish
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDraft(draft.id)}
                                            className="stamp-btn text-xs px-3 py-1"
                                            style={{ background: '#5C1F1F', border: 'none' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </main>

            <Footer />
        </div>
    )
}