import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { getBookmarks } from '../services/bookmarkService'
import { useAuth } from '../context/AuthContext'

export default function Bookmarks() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) navigate('/login')
        else loadBookmarks()
    }, [])

    const loadBookmarks = async () => {
        try {
            const data = await getBookmarks()
            setBookmarks(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-10 w-full">
                {/* Page header */}
                <div className="mb-8">
                    <div className="vintage-rule-thick mb-3"></div>
                    <h1
                        className="text-3xl md:text-4xl font-black text-[#1F1B16]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        My Clippings Library
                    </h1>
                    <p className="byline mt-1 text-[#8B5A2B]">Articles saved for later reading</p>
                    <div className="vintage-rule-thick mt-3"></div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="ink-spinner mb-4"></div>
                        <p className="typewriter-text text-[#8B5A2B] text-sm">Retrieving your clippings…</p>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="paper-card text-center py-20 flex flex-col items-center justify-center">
                        <p className="text-5xl mb-4 opacity-30">📚</p>
                        <h3
                            className="text-xl font-bold text-[#1F1B16] mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Your library is empty
                        </h3>
                        <p className="typewriter-text text-[#8B5A2B] text-sm mb-6">
                            Save articles you wish to return to.
                        </p>
                        <button onClick={() => navigate('/')} className="ink-btn text-xs">
                            Explore the Archive
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {bookmarks.filter(b => b.post != null).map(bookmark => (
                            <BlogCard key={bookmark.id} post={bookmark.post} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}