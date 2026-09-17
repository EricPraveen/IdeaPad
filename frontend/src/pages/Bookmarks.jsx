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
      
      {/* Header */}
      <div className="pb-6 border-b-2 border-[#1A1A1A]">
        <div className="flex items-center justify-between text-xs font-mono text-[#8F8679] mb-1">
          <span>PERSONAL ARCHIVE</span>
          <span>{validPosts.length} CLIPPINGS PRESERVED</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#1A1A1A]">
          My Clippings Library
        </h1>
        <p className="font-body italic text-sm text-[#6B6358] mt-1">
          Dispatches and editorial writings preserved for future reflection.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-xs text-[#8F8679]">Opening your clipping folios…</p>
        </div>
      ) : validPosts.length === 0 ? (
        <div className="paper-card p-12 text-center max-w-md mx-auto my-12 bg-[#FAF6EE]">
          <span className="text-5xl block mb-3 opacity-50">📑</span>
          <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mb-2">
            Your Folio is Empty
          </h3>
          <p className="font-body text-xs text-[#6B6358] mb-6 leading-relaxed">
            While reading dispatches across the Gazette, tap the bookmark ribbon to collect stories into your private study.
          </p>
          <Link to="/" className="stamp-btn text-xs">
            Browse the Front Page
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
