import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { getUserById } from '../services/userService'
import { getPostsByUserId } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { CATEGORY_NAMES } from '../constants/categories'

const allGenres = ['All', ...CATEGORY_NAMES]

export default function UserProfile() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')

  useEffect(() => {
    loadUser()
    loadPosts()
  }, [id])

  useEffect(() => {
    let result = [...posts]
    if (selectedGenre !== 'All') result = result.filter(p => p.genre === selectedGenre)
    if (searchQuery.trim()) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    setFilteredPosts(result)
  }, [posts, searchQuery, selectedGenre])

  const loadUser = async () => {
    try {
      const data = await getUserById(id)
      setProfileUser(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    try {
      const data = await getPostsByUserId(id)
      setPosts(data || [])
      setFilteredPosts(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const isOwnProfile = currentUser && String(currentUser.id) === String(id)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        <div className="w-8 h-8 border-2 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-3"></div>
        <p className="font-mono text-xs text-[#8E857B]">Loading author profile…</p>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <span className="text-4xl block mb-3 opacity-50">👤</span>
        <h2 className="font-serif font-bold text-xl text-[#161412] mb-2">
          Author Not Found
        </h2>
        <p className="font-body text-xs text-[#5C554D] mb-4">
          This author profile does not exist or has been removed.
        </p>
        <Link to="/" className="editorial-btn-primary text-xs">
          Return to Front Page
        </Link>
      </div>
    )
  }

  const totalLikes = posts.reduce((acc, p) => acc + (p.likeCount || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ─── CORRESPONDENT DOSSIER HEADER ─────────────────── */}
      <div className="p-6 sm:p-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#DDD2C1]">
          
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-black text-2xl text-[#7A1C2E] shadow-xs shrink-0">
              {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7A1C2E] px-2 py-0.5 border border-[#7A1C2E] rounded-xs font-semibold">
                CONTRIBUTING WRITER
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#161412] mt-1">
                {profileUser.name || 'Anonymous Author'}
              </h1>
              <p className="font-mono text-xs text-[#8E857B] mt-0.5">
                @{profileUser.username || profileUser.email?.split('@')[0]} · {posts.length} {posts.length === 1 ? 'Article' : 'Articles'} Published
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <Link
              to="/edit-profile"
              className="editorial-btn-secondary text-xs py-2 px-4"
            >
              ⚙ Edit Profile
            </Link>
          )}

        </div>

        {/* Bio */}
        {profileUser.bio && (
          <p className="font-body text-sm text-[#35312C] mt-4 leading-relaxed max-w-3xl italic">
            "{profileUser.bio}"
          </p>
        )}

        {/* Correspondent Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#DDD2C1] text-center">
          <div>
            <div className="font-serif font-bold text-2xl text-[#161412]">{posts.length}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E857B]">Articles</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-[#A67C48]">{totalLikes}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E857B]">Likes</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-[#7A1C2E]">
              {new Set(posts.map(p => p.genre)).size}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E857B]">Categories</div>
          </div>
        </div>

      </div>

      {/* ─── PUBLISHED ARCHIVE ─────────────────────────────── */}
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DDD2C1]">
          <h2 className="font-serif font-bold text-xl text-[#161412]">
            Published Articles ({filteredPosts.length})
          </h2>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full px-3 py-1.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
            />
          </div>
        </div>

        {/* Centralized Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#DDD2C1]">
          {allGenres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`shrink-0 px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 ${
                selectedGenre === g
                  ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold bg-[#EFE8DC]/50'
                  : 'border-transparent text-[#5C554D] hover:text-[#161412] hover:border-[#C4B59F]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
            <span className="text-3xl block mb-2 opacity-50">📰</span>
            <p className="font-body text-xs text-[#5C554D]">
              No published articles found matching the filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

      </div>

    </div>
  )
}
