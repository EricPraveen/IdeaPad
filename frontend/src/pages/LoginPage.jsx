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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="paper-card p-6 sm:p-8 bg-[#FAF6EE] border-2 border-[#DDD2C1] shadow-xl text-center">
        
        {/* Wax Seal Stamp */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#7A1C2E] text-[#FAF6EE] font-serif font-black text-2xl flex items-center justify-center mb-3 shadow-md">
          I
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] mb-1">
          GAZETTE MEMBERSHIP
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1A1A1A]">
          Correspondent Sign In
        </h1>
        <p className="font-body italic text-xs text-[#6B6358] mt-1 mb-6">
          Access your private study, reading library, and dispatch submissions.
        </p>

        {error && (
          <div className="p-3 mb-5 rounded bg-[#FDF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono text-left">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="byline block mb-1">Email or Username</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              required
              placeholder="e.g. emily.dickinson@press.org"
              className="ink-input w-full text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="byline">Access Cipher (Password)</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-mono text-[#8F8679] hover:text-[#7A1C2E]"
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
              className="ink-input w-full text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="stamp-btn w-full py-2.5 text-xs tracking-widest"
            >
              {loading ? 'Verifying Cipher…' : 'Authenticate & Enter'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#DDD2C1] text-xs font-mono text-[#6B6358]">
          New to the publication?{' '}
          <Link to="/register" className="text-[#7A1C2E] hover:underline font-bold">
            Enroll as a Correspondent →
          </Link>
        </div>

      </div>
    </div>
  )
}
