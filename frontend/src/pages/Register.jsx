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
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="paper-card p-6 sm:p-10 bg-[#FAF6EE] border-2 border-[#DDD2C1] shadow-xl text-center">
        
        {/* Wax Seal Stamp */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#7A1C2E] text-[#FAF6EE] font-serif font-black text-2xl flex items-center justify-center mb-3 shadow-md">
          I
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] mb-1">
          SUBSCRIBE TO THE GUILD
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1A1A1A]">
          Correspondent Enrollment
        </h1>
        <p className="font-body italic text-xs text-[#6B6358] mt-1 mb-6">
          Claim your official byline and publish dispatches to readers across the globe.
        </p>

        {error && (
          <div className="p-3 mb-5 rounded bg-[#FDF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono text-left">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="byline block mb-1">Full Legal Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Arthur Conan Doyle"
                className="ink-input w-full text-sm"
              />
            </div>

            <div>
              <label className="byline block mb-1">Author Handle / Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="arthur_doyle"
                className="ink-input w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="byline block mb-1">Official Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="arthur@bakerstreet.co.uk"
              className="ink-input w-full text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="byline">Password (Min 6 Characters)</label>
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
              minLength={6}
              placeholder="••••••••••••"
              className="ink-input w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="byline block mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E]"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Unstated</option>
              </select>
            </div>

            <div>
              <label className="byline block mb-1">Bureau Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E]"
              >
                <option value="">Select</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="byline block mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="stamp-btn w-full py-2.5 text-xs tracking-widest"
            >
              {loading ? 'Issuing Pass…' : 'Enroll in the Gazette'}
            </button>
          </div>

        </form>

        <div className="mt-6 pt-5 border-t border-[#DDD2C1] text-xs font-mono text-[#6B6358]">
          Already have credentials?{' '}
          <Link to="/login" className="text-[#7A1C2E] hover:underline font-bold">
            Sign In to Study →
          </Link>
        </div>

      </div>
    </div>
  )
}
