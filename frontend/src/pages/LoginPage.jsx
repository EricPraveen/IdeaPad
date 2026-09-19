import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
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
      setError('Invalid credentials. Please verify your email/username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-7 sm:p-9 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs shadow-xs text-center">
        
        {/* Editorial Press Stamp */}
        <div className="w-12 h-12 mx-auto rounded-xs bg-[#7A1C2E] text-[#FAF6EE] font-serif font-black text-xl flex items-center justify-center mb-3 shadow-xs">
          I
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#A67C48] mb-1 font-semibold">
          WELCOME BACK
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#161412]">
          Sign In
        </h1>
        <p className="font-body italic text-xs text-[#5C554D] mt-1 mb-6">
          Sign in to access your articles, saved stories, and account.
        </p>

        {error && (
          <div className="p-3 mb-5 rounded-xs bg-[#FAF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono text-left">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              required
              placeholder="you@example.com or username"
              className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-body text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-mono text-[#8E857B] hover:text-[#7A1C2E] cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="editorial-btn-primary w-full py-2.5 text-xs tracking-widest"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#DDD2C1] text-xs font-mono text-[#6E665D]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#7A1C2E] hover:underline font-bold">
            Create an account →
          </Link>
        </div>

      </div>
    </div>
  )
}
