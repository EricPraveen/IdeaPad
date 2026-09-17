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
      alert('Feature status updated for this dispatch.')
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
      
      {/* Header */}
      <div className="pb-6 border-b-2 border-[#1A1A1A]">
        <div className="flex items-center justify-between text-xs font-mono text-[#8F8679] mb-1">
          <span>CONFIDENTIAL · EDITORIAL GOVERNANCE</span>
          <span>ADMINISTRATIVE PRIVILEGES</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1A1A1A]">
          Editor-in-Chief Console
        </h1>
        <p className="font-body italic text-xs sm:text-sm text-[#6B6358] mt-1">
          Moderation queue, dispatch approvals, and journalistic integrity reports.
        </p>
      </div>

      {/* Metrics Ledger */}
      <div className="grid grid-cols-2 gap-4">
        <div className="paper-card p-6 bg-[#FAF6EE] text-center border border-[#DDD2C1]">
          <div className="font-serif font-black text-4xl text-[#7A1C2E]">
            {pendingPosts.length}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8F8679] mt-1">
            Pending Review
          </div>
        </div>
        <div className="paper-card p-6 bg-[#FAF6EE] text-center border border-[#DDD2C1]">
          <div className="font-serif font-black text-4xl text-[#C5A059]">
            {reports.length}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8F8679] mt-1">
            Reader Inquiries / Reports
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div>
        <div className="flex items-center gap-4 border-b border-[#DDD2C1] mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
              activeTab === 'posts'
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold'
                : 'border-transparent text-[#8F8679] hover:text-[#1A1A1A]'
            }`}
          >
            Submissions Queue ({pendingPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold'
                : 'border-transparent text-[#8F8679] hover:text-[#1A1A1A]'
            }`}
          >
            Integrity Reports ({reports.length})
          </button>
        </div>

        {/* Tab 1: Posts */}
        {activeTab === 'posts' && (
          <div>
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-[#8F8679]">
                Reading queue ledger…
              </div>
            ) : pendingPosts.length === 0 ? (
              <div className="paper-card p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE]">
                <span className="text-3xl block mb-2 opacity-50">✓</span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">
                  Queue is clear
                </h3>
                <p className="font-body text-xs text-[#6B6358]">
                  No dispatches currently await editorial review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map(p => (
                  <div
                    key={p.id}
                    className="paper-card p-5 bg-[#FAF6EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#DDD2C1]"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#7A1C2E] uppercase border border-[#7A1C2E] px-1.5 py-0.2 rounded">
                          {p.genre || 'General'}
                        </span>
                        <span className="text-xs font-mono text-[#8F8679]">
                          By {p.authorName || 'Anonymous'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[#1A1A1A]">
                        {p.title}
                      </h4>
                      <p className="font-body text-xs text-[#6B6358] line-clamp-1 mt-1">
                        {p.content?.replace(/<[^>]+>/g, '') || ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleFeature(p.id)}
                        className="ink-btn-ghost text-xs py-1.5 px-3"
                      >
                        ★ Feature
                      </button>
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="stamp-btn text-xs py-1.5 px-3"
                      >
                        Approve for Press
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
              <div className="paper-card p-10 text-center max-w-md mx-auto my-8 bg-[#FAF6EE]">
                <span className="text-3xl block mb-2 opacity-50">⚖</span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">
                  Zero Outstanding Reports
                </h3>
                <p className="font-body text-xs text-[#6B6358]">
                  The publication's discourse is healthy and in accordance with editorial standards.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(rep => (
                  <div
                    key={rep.id}
                    className="paper-card p-5 bg-[#FAF6EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#DDD2C1]"
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#7A1C2E] mb-1">
                        REASON: {rep.reason || 'Flagged by reader'}
                      </div>
                      <p className="font-body text-sm text-[#1A1A1A]">
                        Post Ref #{rep.postId}
                      </p>
                    </div>
                    <button
                      onClick={() => handleResolve(rep.id)}
                      className="stamp-btn text-xs py-1.5 px-3"
                    >
                      Resolve &amp; Archive
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
