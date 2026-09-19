import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia",
  "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China",
  "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece",
  "India", "Indonesia", "Ireland", "Italy", "Japan", "Kenya", "Malaysia",
  "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan",
  "Philippines", "Poland", "Portugal", "Singapore", "South Africa", "South Korea",
  "Spain", "Sweden", "Switzerland", "Turkey", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam"
]

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', username: '',
    gender: '', country: '', dateOfBirth: ''
  })
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
      const data = await register(form)
      loginUser(data)
      navigate('/')
    } catch {
      setError('Registration unsuccessful. An author with this email or username may already exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <div className="p-7 sm:p-10 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs shadow-xs text-center">
        
        {/* Editorial Press Stamp */}
        <div className="w-12 h-12 mx-auto rounded-xs bg-[#7A1C2E] text-[#FAF6EE] font-serif font-black text-xl flex items-center justify-center mb-3 shadow-xs">
          I
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#A67C48] mb-1 font-semibold">
          CREATE AN ACCOUNT
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#161412]">
          Join IDEAPAD
        </h1>
        <p className="font-body italic text-xs text-[#5C554D] mt-1 mb-6">
          Create an account to write, publish, and bookmark stories.
        </p>

        {error && (
          <div className="p-3 mb-5 rounded-xs bg-[#FAF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono text-left">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-body text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="janedoe"
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="jane@example.com"
              className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-body text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E] cursor-pointer"
              >
                <option value="">Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Non-binary / Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Country
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E] cursor-pointer"
              >
                <option value="">Select country...</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="editorial-btn-primary w-full py-2.5 text-xs tracking-widest"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#DDD2C1] text-xs font-mono text-[#6E665D]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7A1C2E] hover:underline font-bold">
            Sign In →
          </Link>
        </div>

      </div>
    </div>
  )
}
