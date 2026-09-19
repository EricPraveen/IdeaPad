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
      setProfileSuccess('Profile updated successfully.')
    } catch {
      setProfileError('Failed to update profile. Please check details.')
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
      setPasswordSuccess('Password changed successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      setPasswordError('Failed to change password. Verify your current password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div className="pb-6 border-b-2 border-[#161412]">
        <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#7A1C2E] font-semibold mb-1">
          ACCOUNT SETTINGS
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#161412]">
          Edit Profile
        </h1>
        <p className="font-body italic text-xs sm:text-sm text-[#5C554D] mt-1">
          Manage your author profile, public details, and account security.
        </p>
      </div>

      {/* ─── PROFILE IDENTITY CARD ─────────────────────────── */}
      <div className="p-6 sm:p-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs shadow-xs">
        <h2 className="font-serif font-bold text-xl text-[#161412] mb-4 pb-2 border-b border-[#DDD2C1]">
          Public Profile
        </h2>

        {profileSuccess && (
          <div className="p-3 mb-4 rounded-xs bg-[#EDF7F0] border border-[#2D6A4F] text-[#2D6A4F] text-xs font-mono">
            ✓ {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="p-3 mb-4 rounded-xs bg-[#FAF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono">
            ⚠ {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-body text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
                Username
              </label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                required
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
              Country
            </label>
            <select
              value={profileForm.country}
              onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
              className="w-full p-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs font-mono text-xs text-[#161412] focus:outline-none focus:border-[#7A1C2E] cursor-pointer"
            >
              <option value="">Select country...</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D] block mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="A brief bio about yourself..."
              className="w-full p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs font-body text-xs sm:text-sm text-[#161412] focus:outline-none focus:border-[#7A1C2E] resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="editorial-btn-primary text-xs py-2 px-6"
            >
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ─── ACCESS CIPHER CARD ─────────────────────────────── */}
      <div className="p-6 sm:p-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs shadow-xs">
        <h2 className="font-serif font-bold text-xl text-[#161412] mb-4 pb-2 border-b border-[#DDD2C1]">
          Change Password
        </h2>

        {passwordSuccess && (
          <div className="p-3 mb-4 rounded-xs bg-[#EDF7F0] border border-[#2D6A4F] text-[#2D6A4F] text-xs font-mono">
            ✓ {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="p-3 mb-4 rounded-xs bg-[#FAF0F0] border border-[#7A1C2E] text-[#7A1C2E] text-xs font-mono">
            ⚠ {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D]">Current Password</label>
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-[10px] font-mono text-[#8E857B] hover:text-[#7A1C2E] cursor-pointer"
              >
                {showCurrent ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D]">New Password</label>
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-[10px] font-mono text-[#8E857B] hover:text-[#7A1C2E] cursor-pointer"
                >
                  {showNew ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#6E665D]">Confirm New Password</label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-[10px] font-mono text-[#8E857B] hover:text-[#7A1C2E] cursor-pointer"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-mono text-[#161412] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="editorial-btn-secondary text-xs py-2 px-6"
            >
              {passwordLoading ? 'Updating Password…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
