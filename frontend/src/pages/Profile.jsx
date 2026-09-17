import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
      setPosts(response || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadDrafts = async () => {
    try {
      const data = await getDrafts()
      setDrafts(data || [])
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
    } catch (err) {
      console.error(err)
      alert('Failed to publish: ' + err.message)
    }
  }

  const handleDeleteDraft = async (id) => {
    if (!window.confirm('Delete this draft permanently from the archive?')) return
    try {
      await deletePost(id)
      setDrafts(drafts.filter(d => d.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const totalLikes = posts.reduce((acc, p) => acc + (p.likeCount || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ─── CORRESPONDENT DOSSIER HEADER ─────────────────── */}
      <div className="paper-card p-6 sm:p-8 bg-[#FAF6EE] border-2 border-[#DDD2C1] shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#DDD2C1]">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#EFE8DC] border-2 border-[#C5A059] flex items-center justify-center font-serif font-black text-3xl text-[#7A1C2E] shadow-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A1C2E] px-2 py-0.5 border border-[#7A1C2E] rounded">
                  ACCIDENTAL WRITER · CORRESPONDENT
                </span>
                {user?.role === 'admin' && (
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-[#7A1C2E] text-[#FAF6EE] px-2 py-0.5 rounded">
                    EDITOR-IN-CHIEF
                  </span>
                )}
              </div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                {user?.name || 'Fellow Correspondent'}
              </h1>
              <p className="font-mono text-xs text-[#8F8679] mt-0.5">
                @{user?.username || user?.email?.split('@')[0]} · {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/edit-profile"
              className="ink-btn-ghost text-xs py-2 px-4 flex-1 sm:flex-none text-center"
            >
              ⚙ Edit Profile
            </Link>
            <Link
              to="/write"
              className="stamp-btn text-xs py-2 px-4 flex-1 sm:flex-none text-center"
            >
              ✍ New Dispatch
            </Link>
          </div>

        </div>

        {/* Bio */}
        {user?.bio && (
          <p className="font-body text-sm text-[#3A3530] mt-4 leading-relaxed max-w-3xl">
            "{user.bio}"
          </p>
        )}

        {/* Correspondent Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#DDD2C1] text-center">
          <div>
            <div className="font-serif font-bold text-2xl text-[#1A1A1A]">{posts.length}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F8679]">Published</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-[#7A1C2E]">{drafts.length}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F8679]">Drafts</div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-[#C5A059]">{totalLikes}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8F8679]">Total Endorsements</div>
          </div>
        </div>

      </div>

      {/* ─── TABBED ARCHIVES ──────────────────────────────── */}
      <div>
        <div className="flex items-center gap-4 border-b border-[#DDD2C1] mb-6">
          <button
            onClick={() => setActiveTab('published')}
            className={`pb-3 text-sm font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
              activeTab === 'published'
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold'
                : 'border-transparent text-[#8F8679] hover:text-[#1A1A1A]'
            }`}
          >
            Published Dispatches ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-3 text-sm font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
              activeTab === 'drafts'
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold'
                : 'border-transparent text-[#8F8679] hover:text-[#1A1A1A]'
            }`}
          >
            Draft Manuscripts ({drafts.length})
          </button>
        </div>

        {/* Tab Content: Published */}
        {activeTab === 'published' && (
          <div>
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-[#8F8679]">
                Gathering dispatches…
              </div>
            ) : posts.length === 0 ? (
              <div className="paper-card p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE]">
                <span className="text-4xl block mb-2 opacity-50">📰</span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">
                  No published stories yet
                </h3>
                <p className="font-body text-xs text-[#6B6358] mb-4">
                  Share your perspectives, reports, and reflections with the Gazette.
                </p>
                <Link to="/write" className="stamp-btn text-xs">
                  Compose First Article
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    isOwner={true}
                    onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Drafts */}
        {activeTab === 'drafts' && (
          <div>
            {drafts.length === 0 ? (
              <div className="paper-card p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE]">
                <span className="text-4xl block mb-2 opacity-50">📝</span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">
                  No pending drafts
                </h3>
                <p className="font-body text-xs text-[#6B6358] mb-4">
                  All your thoughts have either been released to the press or not yet begun.
                </p>
                <Link to="/write" className="stamp-btn text-xs">
                  Start a Draft
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {drafts.map(draft => (
                  <div
                    key={draft.id}
                    className="paper-card p-5 bg-[#FAF6EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] border border-[#C5A059] px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                        <span className="text-xs font-mono text-[#8F8679]">
                          {draft.genre || 'General'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[#1A1A1A]">
                        {draft.title || 'Untitled Manuscript'}
                      </h4>
                      <p className="font-body text-xs text-[#6B6358] line-clamp-1 mt-1">
                        {draft.content?.replace(/<[^>]+>/g, '') || 'No content yet…'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/write?edit=${draft.id}`)}
                        className="ink-btn-ghost text-xs py-1.5 px-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublish(draft.id)}
                        className="stamp-btn text-xs py-1.5 px-3"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-xs font-mono text-[#7A1C2E] hover:underline px-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  )
}
