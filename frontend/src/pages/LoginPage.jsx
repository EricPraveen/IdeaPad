import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
    const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                email: form.usernameOrEmail,
                username: form.usernameOrEmail,
                password: form.password
            }
            const data = await login(payload)
            loginUser(data)
            navigate('/')
        } catch {
            setError('Invalid credentials. Please check your details.')
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-6 py-16">
                <div className="w-full max-w-md ink-reveal">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M24 4 L28 18 L24 22 L20 18 Z" fill="#1F1B16" stroke="#8B5A2B" strokeWidth="1"/>
                                <line x1="24" y1="11" x2="24" y2="22" stroke="#B08968" strokeWidth="0.8"/>
                                <path d="M24 22 L22 28 L24 44 L26 28 Z" fill="#7A2E2E" stroke="#5C1F1F" strokeWidth="0.8"/>
                            </svg>
                        </div>
                        <div className="vintage-rule-double mb-4"></div>
                        <h1 className="text-3xl font-black text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Sign In to the Press
                        </h1>
                        <p className="typewriter-text text-[#8B5A2B] text-sm mt-2">
                            Continue your editorial journey
                        </p>
                        <div className="vintage-rule-double mt-4"></div>
                    </div>

                    {/* Form card */}
                    <div className="paper-card p-8">
                        {error && (
                            <div className="border border-[#7A2E2E] bg-[#FBF0F0] text-[#7A2E2E] p-4 mb-6 text-sm flex items-center gap-3">
                                <span>⚠</span>
                                <span style={{ fontFamily: "'IBM Plex Serif', serif" }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="byline block mb-2">Username or Email</label>
                                <input
                                    type="text"
                                    name="usernameOrEmail"
                                    value={form.usernameOrEmail}
                                    onChange={handleChange}
                                    required
                                    className="ink-input w-full"
                                    placeholder="username or you@example.com"
                                />
                            </div>

                            <div>
                                <label className="byline block mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="ink-input w-full pr-10"
                                        placeholder="Your secret key"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B5A2B] hover:text-[#1F1B16]"
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                                <line x1="2" x2="22" y1="2" y2="22"/>
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="stamp-btn w-full py-3 text-sm tracking-widest mt-2">
                                Enter the Press Room
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-[#E0D4C0] text-center">
                            <p className="typewriter-text text-xs text-[#8B5A2B]">
                                New to IdeaPad?{' '}
                                <Link to="/register" className="text-[#7A2E2E] font-semibold hover:underline">
                                    Join the Press
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}