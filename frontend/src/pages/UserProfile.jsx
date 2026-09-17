import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { getUserById } from '../services/userService'
import { getPostsByUserId } from '../services/postService'
import { useAuth } from '../context/AuthContext'

const genres = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Fiction', 'Opinion', 'Health', 'Finance', 'Gaming', 'Culture', 'Else']

export default function UserProfile() {
    const { id } = useParams()
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()
    const [profileUser, setProfileUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [postsLoading, setPostsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGenre, setSelectedGenre] = useState('All')

    useEffect(() => {
        loadUser()
        loadPosts()
    }, [id])

    useEffect(() => { filterPosts() }, [posts, searchQuery, selectedGenre])

    const loadUser = async () => {
        try {
            const data = await getUserById(id)
            setProfileUser(data)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const loadPosts = async () => {
        try {
            const data = await getPostsByUserId(id)
            setPosts(data)
            setFilteredPosts(data)
        } catch (err) { console.error(err) }
        finally { setPostsLoading(false) }
    }

    const filterPosts = () => {
        let result = [...posts]
        if (selectedGenre !== 'All') result = result.filter(p => p.genre === selectedGenre)
        if (searchQuery.trim()) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        setFilteredPosts(result)
    }

    const handleClearFilters = () => {
        setSearchQuery(''); setSelectedGenre('All'); setFilteredPosts(posts)
    }

    const getJoinedDate = (dateStr) => {
        if (!dateStr) return 'Unknown'
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }

    const isOwnProfile = currentUser && String(currentUser.id) === String(id)
    const isFiltered = searchQuery.trim() || selectedGenre !== 'All'

    if (loading) return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center py-24">
                <div className="ink-spinner mb-4"></div>
                <p className="typewriter-text text-[#8B5A2B] text-sm">Retrieving correspondent profile…</p>
            </div>
            <Footer />
        </div>
    )

    if (!profileUser) return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
                <p className="text-5xl mb-4">👤</p>
                <h3 className="text-xl font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Correspondent not found
                </h3>
                <button onClick={() => navigate('/')} className="mt-6 ink-btn text-xs">Return to Archive</button>
            </div>
            <Footer />
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-10 w-full fade-in">

                {/* Author header card */}
                <div className="paper-card p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div
                            className="w-20 h-20 rounded-full border-2 border-[#8B5A2B] flex items-center justify-center shrink-0"
                            style={{ background: '#EADCC5' }}
                        >
                            <span className="text-3xl font-black text-[#7A2E2E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {profileUser.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-2xl font-black text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {profileUser.name}
                                </h1>
                                {isOwnProfile && (
                                    <span className="genre-label" style={{ color: '#7A2E2E', borderColor: '#7A2E2E', fontSize: '0.6rem' }}>
                                        YOU
                                    </span>
                                )}
                            </div>
                            <p className="byline">@{profileUser.username || 'anonymous'}</p>

                            {profileUser.bio && (
                                <p className="text-[#4A3F32] text-sm leading-relaxed mt-3 max-w-xl" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
                                    {profileUser.bio}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#E0D4C0]">
                                {profileUser.country && (
                                    <div>
                                        <p className="section-header" style={{ fontSize: '0.6rem', marginBottom: '0.15rem', borderBottom: 'none' }}>Location</p>
                                        <p className="typewriter-text text-[#4A3F32] text-xs">{profileUser.country}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="section-header" style={{ fontSize: '0.6rem', marginBottom: '0.15rem', borderBottom: 'none' }}>Correspondent Since</p>
                                    <p className="typewriter-text text-[#4A3F32] text-xs">{getJoinedDate(profileUser.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="section-header" style={{ fontSize: '0.6rem', marginBottom: '0.15rem', borderBottom: 'none' }}>Articles Published</p>
                                    <p className="typewriter-text text-[#4A3F32] text-xs">{posts.length}</p>
                                </div>
                            </div>
                        </div>

                        {isOwnProfile && (
                            <button onClick={() => navigate('/edit-profile')} className="ink-btn-ghost text-xs shrink-0">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Articles section */}
                <div>
                    <div className="section-header">
                        {isOwnProfile ? 'My Dispatches' : `Articles by ${profileUser.name}`}
                    </div>

                    {/* Search + Genre Filter */}
                    {!postsLoading && posts.length > 0 && (
                        <div className="paper-card p-4 mb-6">
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by title…"
                                    className="ink-input flex-1 text-sm"
                                />
                                {isFiltered && (
                                    <button onClick={handleClearFilters} className="ink-btn-ghost text-xs px-3">
                                        ✕ Clear
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {genres.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setSelectedGenre(g)}
                                        className="genre-label text-xs transition-all"
                                        style={{
                                            fontFamily: "'Special Elite', monospace",
                                            color: selectedGenre === g ? '#FAF6EE' : '#8B5A2B',
                                            background: selectedGenre === g ? '#7A2E2E' : 'transparent',
                                            borderColor: selectedGenre === g ? '#7A2E2E' : '#8B5A2B',
                                            padding: '0.15rem 0.6rem',
                                            fontSize: '0.6rem',
                                        }}
                                    >
                                        {g.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            {isFiltered && (
                                <p className="typewriter-text text-[#8B5A2B] text-xs mt-2">
                                    Showing {filteredPosts.length} of {posts.length} articles
                                </p>
                            )}
                        </div>
                    )}

                    {postsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="ink-spinner mb-4"></div>
                            <p className="typewriter-text text-[#8B5A2B] text-sm">Loading dispatches…</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="paper-card text-center py-16 flex flex-col items-center">
                            <p className="text-4xl mb-4 opacity-30">📭</p>
                            <h3 className="text-lg font-bold text-[#1F1B16] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                No articles yet
                            </h3>
                            <p className="typewriter-text text-[#8B5A2B] text-sm">
                                {isOwnProfile ? 'You have not published any posts yet.' : `${profileUser.name} has not published yet.`}
                            </p>
                            {isOwnProfile && (
                                <button onClick={() => navigate('/write')} className="stamp-btn text-xs mt-5">
                                    Write First Article
                                </button>
                            )}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="paper-card text-center py-12">
                            <p className="typewriter-text text-[#8B5A2B] text-sm mb-3">No articles match your filter.</p>
                            <button onClick={handleClearFilters} className="ink-btn-ghost text-xs">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredPosts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    onDelete={(deletedId) => {
                                        setPosts(posts.filter(p => String(p.id) !== String(deletedId)))
                                        setFilteredPosts(filteredPosts.filter(p => String(p.id) !== String(deletedId)))
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}