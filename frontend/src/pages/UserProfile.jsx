import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
        <div className="w-10 h-10 border-3 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-xs text-[#8F8679]">Reviewing correspondent ledger…</p>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <span className="text-4xl block mb-3 opacity-50">👤</span>
        <h2 className="font-serif font-bold text-xl text-[#1A1A1A] mb-2">
          Correspondent Not Found
        </h2>
        <p className="font-body text-xs text-[#6B6358] mb-4">
          This author profile does not exist or has been withdrawn.
        </p>
        <Link to="/" className="stamp-btn text-xs">
          Return to Front Page
        </Link>
      </div>
    )
  }

  const totalLikes = posts.reduce((acc, p) => acc + (p.likeCount || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ─── CORRESPONDENT DOSSIER HEADER ─────────────────── */}
      <div className="paper-card p-6 sm:p-8 bg-[#FAF6EE] border-2 border-[#DDD2C1] shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#DDD2C1]">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#EFE8DC] border-2 border-[#C5A059] flex items-center justify-center font-serif font-black text-3xl text-[#7A1C2E] shadow-sm shrink-0">
              {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1C2E] px-2 py-0.5 border border-[#7A1C2E] rounded">
                CONTRIBUTING CORRESPONDENT
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                {profileUser.name}
              </h1>
              <p className="font-mono text-xs text-[#8F8679] mt-0.5">
                @{profileUser.username || profileUser.email?.split('@')[0]}
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <Link
              to="/edit-profile"
              className="ink-btn-ghost text-xs py-2 px-4"
            >
              ⚙ Edit Author Credentials
            </Link>
          )}

        </div>

        {/* Bio */}
        {profileUser.bio && (
          <p className="font-body text-sm text-[#3A3530] mt-4 leading-relaxed max-w-3xl italic">
            "{profileUser.bio}"
          </p>
        )}

        {/* Correspondent Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#DDD2C1] text-center">
          <div>
            <div className="font-serif font-bold text-2xl text-[#1A1A1A]">{posts.length}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F8679]">Articles Published</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-[#7A1C2E]">{totalLikes}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F8679]">Reader Endorsements</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-[#C5A059]">100%</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F8679]">Editorial Integrity</div>
          </div>
        </div>

      </div>

      {/* ─── PUBLISHED ARCHIVE ─────────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#DDD2C1]">
          <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">
            Published Dispatches ({filteredPosts.length})
          </h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter author's posts..."
              className="px-3 py-1.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded text-xs font-mono focus:outline-none focus:border-[#7A1C2E]"
            />
          </div>
        </div>

        {/* Genre pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-6">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                selectedGenre === g
                  ? 'bg-[#7A1C2E] text-[#FAF6EE] border-[#7A1C2E]'
                  : 'bg-[#FAF6EE] text-[#3A3530] border-[#DDD2C1] hover:border-[#7A1C2E]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="paper-card p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE]">
            <span className="text-4xl block mb-2 opacity-50">📰</span>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">
              No matching dispatches
            </h3>
            <p className="font-body text-xs text-[#6B6358]">
              No articles by this correspondent match the current filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
