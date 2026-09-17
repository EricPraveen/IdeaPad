import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../services/userService'

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada",
  "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece",
  "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Kenya", "Malaysia", "Mexico",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Philippines", "Poland",
  "Portugal", "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland",
  "Turkey", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
]

const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function EditProfile() {
  const { user, loginUser } = useAuth()
  const navigate = useNavigate()

  const [profileForm, setProfileForm] = useState({ name: '', username: '', bio: '', country: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
    else {
      setProfileForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        country: user.country || ''
      })
    }
  }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')
    try {
      const updated = await updateProfile(profileForm)
      loginUser({ ...user, ...updated })
      setProfileSuccess('Correspondent credentials updated successfully.')
    } catch {
      setProfileError('Failed to update credentials. Please check details.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setPasswordSuccess('Access cipher changed successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      setPasswordError('Failed to change password. Verify your current password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b-2 border-[#1A1A1A]">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A1C2E] mb-1">
          SETTINGS &amp; LEDGER
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1A1A1A]">
          Author Credentials
        </h1>
        <p className="font-body italic text-xs sm:text-sm text-[#6B6358] mt-1">
          Manage your editorial byline, personal dossier, and cryptographic key.
        </p>
      </div>

      {/* ─── PROFILE CARD ──────────────────────────────────── */}
      <div className="paper-card p-6 sm:p-8 bg-[#FAF6EE] border border-[#DDD2C1]">
        <h2 className="font-serif font-bold text-xl text-[#1A1A1A] mb-4 pb-2 border-b border-[#DDD2C1]">
          Public Correspondent Identity
        </h2>

        {profileSuccess && (
          <div className="p-3 mb-4 rounded bg-[#EBF7EE] border border-[#2D6A4F] text-[#2D6A4F] text-xs font-mono">
            ✓ {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="p-3 mb-4 rounded bg-[#FDF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono">
            ⚠ {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="byline block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="ink-input w-full"
              />
            </div>

            <div>
              <label className="byline block mb-1">Writer Handle / Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                required
                className="ink-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="byline block mb-1">Country / Dispatch Bureau</label>
            <select
              value={profileForm.country}
              onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
              className="w-full p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E]"
            >
              <option value="">Select Bureau Location</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="byline block mb-1">Brief Literary Biography</label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="A few sentences summarizing your inquiries, essays, and areas of study..."
              className="ink-input w-full resize-none font-body text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="stamp-btn text-xs py-2 px-6"
            >
              {profileLoading ? 'Saving Credentials…' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>

      {/* ─── PASSWORD CARD ─────────────────────────────────── */}
      <div className="paper-card p-6 sm:p-8 bg-[#FAF6EE] border border-[#DDD2C1]">
        <h2 className="font-serif font-bold text-xl text-[#1A1A1A] mb-4 pb-2 border-b border-[#DDD2C1]">
          Account Security &amp; Access Cipher
        </h2>

        {passwordSuccess && (
          <div className="p-3 mb-4 rounded bg-[#EBF7EE] border border-[#2D6A4F] text-[#2D6A4F] text-xs font-mono">
            ✓ {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="p-3 mb-4 rounded bg-[#FDF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono">
            ⚠ {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="byline block mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="ink-input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8679] hover:text-[#1A1A1A]"
              >
                <EyeIcon open={showCurrent} />
              </button>
            </div>
          </div>

          <div>
            <label className="byline block mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="ink-input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8679] hover:text-[#1A1A1A]"
              >
                <EyeIcon open={showNew} />
              </button>
            </div>
          </div>

          <div>
            <label className="byline block mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                className="ink-input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8679] hover:text-[#1A1A1A]"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="ink-btn text-xs py-2 px-6"
            >
              {passwordLoading ? 'Updating Key…' : 'Update Access Cipher'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
