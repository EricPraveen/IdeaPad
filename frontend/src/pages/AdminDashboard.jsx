import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getPendingPosts, approvePost, featurePost,
  getPendingReports, resolveReport
} from '../services/adminService'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pendingPosts, setPendingPosts] = useState([])
  const [reports, setReports] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/')
    else loadData()
  }, [])

  const loadData = async () => {
    try {
      const [posts, reps] = await Promise.all([getPendingPosts(), getPendingReports()])
      setPendingPosts(posts || [])
      setReports(reps || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await approvePost(id)
      setPendingPosts(pendingPosts.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleFeature = async (id) => {
    try {
      await featurePost(id)
      alert('Featured status updated for this article.')
    } catch (err) {
      console.error(err)
    }
  }

  const handleResolve = async (id) => {
    try {
      await resolveReport(id)
      setReports(reports.filter(r => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div className="pb-6 border-b-2 border-[#161412]">
        <div className="flex items-center justify-between text-xs font-mono text-[#8E857B] mb-1">
          <span>ADMINISTRATION &amp; MODERATION</span>
          <span>ADMIN PRIVILEGES</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#161412]">
          Admin Dashboard
        </h1>
        <p className="font-body italic text-xs sm:text-sm text-[#5C554D] mt-1">
          Review articles, manage featured posts, and oversee reports.
        </p>
      </div>

      {/* Metrics Ledger */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-[#FAF6EE] text-center border border-[#DDD2C1] rounded-xs shadow-xs">
          <div className="font-serif font-black text-4xl text-[#7A1C2E]">
            {pendingPosts.length}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E857B] mt-1">
            Pending Review
          </div>
        </div>
        <div className="p-6 bg-[#FAF6EE] text-center border border-[#DDD2C1] rounded-xs shadow-xs">
          <div className="font-serif font-black text-4xl text-[#A67C48]">
            {reports.length}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8E857B] mt-1">
            Reported Items
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div>
        <div className="flex items-center gap-4 border-b border-[#DDD2C1] mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
              activeTab === 'posts'
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold'
                : 'border-transparent text-[#8E857B] hover:text-[#161412]'
            }`}
          >
            Articles Queue ({pendingPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold'
                : 'border-transparent text-[#8E857B] hover:text-[#161412]'
            }`}
          >
            User Reports ({reports.length})
          </button>
        </div>

        {/* Tab 1: Posts */}
        {activeTab === 'posts' && (
          <div>
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-[#8E857B]">
                Loading review queue…
              </div>
            ) : pendingPosts.length === 0 ? (
              <div className="p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
                <span className="text-3xl block mb-2 opacity-50">✓</span>
                <h3 className="font-serif font-bold text-lg text-[#161412] mb-1">
                  Queue is clear
                </h3>
                <p className="font-body text-xs text-[#5C554D]">
                  No articles currently await review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map(p => (
                  <div
                    key={p.id}
                    className="p-5 bg-[#FAF6EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#DDD2C1] rounded-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#7A1C2E] uppercase border border-[#7A1C2E] px-1.5 py-0.5 rounded-xs">
                          {p.genre || 'General'}
                        </span>
                        <span className="text-xs font-mono text-[#8E857B]">
                          By {p.authorName || 'Anonymous'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[#161412]">
                        {p.title}
                      </h4>
                      <p className="font-body text-xs text-[#5C554D] line-clamp-1 mt-1">
                        {p.content?.replace(/<[^>]+>/g, '') || ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleFeature(p.id)}
                        className="editorial-btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                      >
                        ★ Feature
                      </button>
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="editorial-btn-primary text-xs py-1.5 px-3 cursor-pointer"
                      >
                        Approve Article
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reports */}
        {activeTab === 'reports' && (
          <div>
            {reports.length === 0 ? (
              <div className="p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
                <span className="text-3xl block mb-2 opacity-50">⚖</span>
                <h3 className="font-serif font-bold text-lg text-[#161412] mb-1">
                  No Reports
                </h3>
                <p className="font-body text-xs text-[#5C554D]">
                  There are no pending reports at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-5 bg-[#FAF6EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#DDD2C1] rounded-xs"
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#7A1C2E] mb-1">
                        REASON: {rep.reason || 'Flagged by reader'}
                      </div>
                      <p className="font-body text-sm text-[#161412]">
                        Post Ref #{rep.postId}
                      </p>
                    </div>
                    <button
                      onClick={() => handleResolve(rep.id)}
                      className="editorial-btn-primary text-xs py-1.5 px-3 cursor-pointer"
                    >
                      Resolve Report
                    </button>
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
