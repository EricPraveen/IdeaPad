import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
            setPendingPosts(posts)
            setReports(reps)
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const handleApprove = async (id) => {
        try {
            await approvePost(id)
            setPendingPosts(pendingPosts.filter(p => p.id !== id))
        } catch (err) { console.error(err) }
    }

    const handleFeature = async (id) => {
        try {
            await featurePost(id)
            alert('Feature status toggled!')
        } catch (err) { console.error(err) }
    }

    const handleResolve = async (id) => {
        try {
            await resolveReport(id)
            setReports(reports.filter(r => r.id !== id))
        } catch (err) { console.error(err) }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-10 w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="vintage-rule-thick mb-3"></div>
                    <h1 className="text-3xl font-black text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Editorial Board
                    </h1>
                    <p className="byline mt-1 text-[#7A2E2E]">Administrator Control Room</p>
                    <div className="vintage-rule-thick mt-3"></div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="paper-card p-5 text-center">
                        <p className="text-3xl font-black text-[#7A2E2E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {pendingPosts.length}
                        </p>
                        <p className="byline mt-1">Pending Review</p>
                    </div>
                    <div className="paper-card p-5 text-center">
                        <p className="text-3xl font-black text-[#7A2E2E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {reports.length}
                        </p>
                        <p className="byline mt-1">Open Reports</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    {['posts', 'reports'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="genre-label transition-all"
                            style={{
                                fontFamily: "'Special Elite', monospace",
                                color: activeTab === tab ? '#FAF6EE' : '#8B5A2B',
                                background: activeTab === tab ? '#7A2E2E' : 'transparent',
                                borderColor: activeTab === tab ? '#7A2E2E' : '#8B5A2B',
                                padding: '0.35rem 1.2rem',
                            }}
                        >
                            {tab === 'posts'
                                ? `PENDING POSTS (${pendingPosts.length})`
                                : `REPORTS (${reports.length})`
                            }
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="ink-spinner mb-4"></div>
                        <p className="typewriter-text text-[#8B5A2B] text-sm">Loading the editorial queue…</p>
                    </div>
                ) : activeTab === 'posts' ? (
                    <div className="flex flex-col gap-5">
                        {pendingPosts.length === 0 ? (
                            <div className="paper-card p-12 text-center">
                                <p className="text-4xl mb-4 opacity-30">✓</p>
                                <h3 className="text-lg font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    All caught up
                                </h3>
                                <p className="typewriter-text text-[#8B5A2B] text-sm mt-2">No posts pending editorial review.</p>
                            </div>
                        ) : (
                            pendingPosts.map(post => (
                                <div key={post.id} className="paper-card p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="genre-label" style={{ color: '#3B5998', borderColor: '#3B5998' }}>
                                            {post.genre}
                                        </span>
                                    </div>
                                    <h2
                                        className="text-xl font-bold text-[#1F1B16] mb-2"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {post.title}
                                    </h2>
                                    <p className="text-[#4A3F32] text-sm mb-5 line-clamp-2">
                                        {post.content?.replace(/<[^>]+>/g, '')}
                                    </p>
                                    <hr className="vintage-rule mb-4" />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(post.id)}
                                            className="ink-btn text-xs"
                                            style={{ background: '#2E7D52', borderColor: '#2E7D52' }}
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => handleFeature(post.id)}
                                            className="ink-btn-ghost text-xs"
                                            style={{ color: '#7A2E2E', borderColor: '#7A2E2E' }}
                                        >
                                            ★ Feature
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {reports.length === 0 ? (
                            <div className="paper-card p-12 text-center">
                                <p className="text-4xl mb-4 opacity-30">✓</p>
                                <h3 className="text-lg font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    All clear
                                </h3>
                                <p className="typewriter-text text-[#8B5A2B] text-sm mt-2">No pending reports.</p>
                            </div>
                        ) : (
                            reports.map(report => (
                                <div key={report.id} className="paper-card p-6">
                                    <div className="border border-[#C8B89A] bg-[#FBF0F0] p-4 mb-4">
                                        <p className="byline text-[#7A2E2E] mb-1">Reported Issue</p>
                                        <p className="text-sm text-[#4A3F32]">{report.reason}</p>
                                    </div>
                                    <p className="byline mb-4">
                                        Reference Post ID: <code className="typewriter-text bg-[#EADCC5] px-2 py-0.5 text-sm">{report.post?.id}</code>
                                    </p>
                                    <button
                                        onClick={() => handleResolve(report.id)}
                                        className="ink-btn text-xs"
                                    >
                                        Mark as Resolved
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}