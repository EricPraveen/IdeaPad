import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import GenreFilter from '../components/GenreFilter'
import SearchBar from '../components/SearchBar'
import {
    getAllPosts,
    getPostsByGenre,
    searchPosts,
    getRandomPost,
    getFeaturedPosts
} from '../services/postService'

const QUOTES = [
    { text: "The pen is mightier than the sword.", author: "Edward Bulwer-Lytton" },
    { text: "A writer only begins a book. A reader finishes it.", author: "Samuel Johnson" },
    { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
    { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
    { text: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
]

export default function Home() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [featured, setFeatured] = useState([])
    const [selectedGenre, setSelectedGenre] = useState('All')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const quote = QUOTES[new Date().getDay() % QUOTES.length]

    const getFormattedName = () => {
        if (!user) return null
        const raw = user.name || user.email?.split('@')[0] || 'Reader'
        return raw.charAt(0).toUpperCase() + raw.slice(1)
    }

    useEffect(() => {
        const genre = searchParams.get('genre')
        const q = searchParams.get('q')
        if (q) {
            handleSearch(q)
        } else if (genre) {
            setSelectedGenre(genre)
            handleGenreSelect(genre)
        } else {
            loadPosts()
        }
        loadFeatured()
    }, [searchParams])

    const loadPosts = async () => {
        try {
            const data = await getAllPosts()
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadFeatured = async () => {
        try {
            const data = await getFeaturedPosts()
            setFeatured(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleGenreSelect = async (genre) => {
        setSelectedGenre(genre)
        setLoading(true)
        try {
            const data = genre === 'All' ? await getAllPosts() : await getPostsByGenre(genre)
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query) => {
        if (!query) return loadPosts()
        setLoading(true)
        try {
            const data = await searchPosts(query)
            setPosts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSurpriseMe = async () => {
        try {
            const post = await getRandomPost()
            navigate(`/post/${post.id}`)
        } catch {
            alert('No posts available yet!')
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* Breaking news ticker */}
            <div className="bg-[#7A2E2E] text-[#FAF6EE] py-1.5 overflow-hidden">
                <div className="flex items-center">
                    <span
                        className="shrink-0 bg-[#1F1B16] text-[#F5EAD7] px-4 py-0.5 text-xs uppercase tracking-widest z-10"
                        style={{ fontFamily: "'Special Elite', monospace" }}
                    >
                        Latest
                    </span>
                    <div className="overflow-hidden flex-1 ml-3">
                        <span className="ticker-text text-xs" style={{ fontFamily: "'Special Elite', monospace", letterSpacing: '0.05em' }}>
                            {posts.slice(0, 5).map(p => p.title).join('  ·  ') || 'Welcome to IdeaPad — The Independent Voice of Ideas'}
                        </span>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-8 w-full">

                {/* Welcome / Hero strip */}
                <div className="mb-8 text-center py-6 border-b-2 border-[#1F1B16]">
                    {user ? (
                        <>
                            <p className="byline mb-1">Good day, {getFormattedName()}</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Your reading awaits
                            </h2>
                        </>
                    ) : (
                        <>
                            <p className="byline mb-1">Established in the pursuit of great ideas</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Discover Stories Worth Reading
                            </h2>
                        </>
                    )}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleSurpriseMe}
                            className="ink-btn-ghost text-xs"
                        >
                            ✦ Surprise Me
                        </button>
                    </div>
                </div>

                {/* Featured Posts — Newspaper hero layout */}
                {featured.length > 0 && (
                    <section className="mb-10">
                        <div className="section-header">Editor's Featured Selections</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {featured.slice(0, 4).map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Double rule separator */}
                <div className="vintage-rule-double my-8"></div>

                {/* Search + Filter section */}
                <section className="mb-8">
                    <div className="section-header">Search The Archive</div>
                    <SearchBar onSearch={handleSearch} />
                    <GenreFilter selected={selectedGenre} onSelect={handleGenreSelect} />
                </section>

                {/* All Posts grid */}
                <section>
                    <div className="section-header">
                        {selectedGenre === 'All' ? 'Latest Dispatches' : `${selectedGenre} — Field Reports`}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="ink-spinner mb-4"></div>
                            <p className="typewriter-text text-[#8B5A2B] text-sm">Composing the press…</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="paper-card text-center py-20 flex flex-col items-center justify-center">
                            <p className="text-5xl mb-4 opacity-40">📰</p>
                            <h3 className="text-xl font-bold text-[#1F1B16] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                No dispatches found
                            </h3>
                            <p className="text-[#8B5A2B] typewriter-text text-sm">
                                Try adjusting your search or genre filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {posts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    onDelete={(id) => setPosts(prev => prev.filter(p => String(p.id) !== String(id)))}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Quote of the Day */}
                <div className="mt-16 mb-4 text-center py-10 border-t border-b border-[#C8B89A]">
                    <p className="byline mb-3 text-[#7A2E2E]">Quote of the Day</p>
                    <blockquote
                        className="text-xl md:text-2xl italic text-[#1F1B16] max-w-2xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        "{quote.text}"
                    </blockquote>
                    <p className="byline mt-3">— {quote.author}</p>
                </div>

            </main>

            <Footer />
        </div>
    )
}