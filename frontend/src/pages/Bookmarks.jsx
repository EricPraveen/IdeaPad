import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
      setBookmarks(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validPosts = bookmarks.map(b => b.post).filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div className="pb-6 border-b-2 border-[#161412]">
        <div className="flex items-center justify-between text-xs font-mono text-[#8E857B] mb-1">
          <span>SAVED ARTICLES</span>
          <span>{validPosts.length} {validPosts.length === 1 ? 'STORY SAVED' : 'STORIES SAVED'}</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#161412]">
          Saved Articles
        </h1>
        <p className="font-body italic text-sm text-[#5C554D] mt-1">
          Articles and stories you have bookmarked to read later.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-3"></div>
          <p className="font-mono text-xs text-[#8E857B]">Loading your saved articles…</p>
        </div>
      ) : validPosts.length === 0 ? (
        <div className="p-12 text-center max-w-md mx-auto my-12 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
          <span className="text-4xl block mb-3 opacity-50">📑</span>
          <h3 className="font-serif font-bold text-xl text-[#161412] mb-2">
            No Saved Articles
          </h3>
          <p className="font-body text-xs text-[#5C554D] mb-6 leading-relaxed">
            When reading articles on IDEAPAD, click the bookmark icon to save stories here for later.
          </p>
          <Link to="/" className="editorial-btn-primary text-xs">
            Explore Articles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validPosts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              onDelete={() => loadBookmarks()}
            />
          ))}
        </div>
      )}

    </div>
  )
}
