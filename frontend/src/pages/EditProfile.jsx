import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../services/userService'

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
    "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Chile", "China", "Colombia", "Croatia", "Cuba",
    "Cyprus", "Czechia", "Denmark", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Estonia", "Ethiopia", "Fiji",
    "Finland", "France", "Germany", "Ghana", "Greece",
    "Guatemala", "Haiti", "Honduras", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos",
    "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
    "Malaysia", "Maldives", "Mali", "Malta", "Mexico",
    "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Nigeria", "North Korea", "Norway", "Oman",
    "Pakistan", "Panama", "Paraguay", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia",
    "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Singapore",
    "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea",
    "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia",
    "Turkey", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

const EyeIcon = ({ open }) => open ? (
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

    const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setProfileLoading(true); setProfileError(''); setProfileSuccess('')
        try {
            const updatedUser = await updateProfile(profileForm)
            loginUser({ ...user, name: updatedUser.name, username: updatedUser.username, bio: updatedUser.bio, country: updatedUser.country })
            setProfileSuccess('Profile updated successfully!')
        } catch (err) {
            setProfileError(err.response?.data?.message || err.response?.data || 'Failed to update profile')
        } finally { setProfileLoading(false) }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordLoading(true); setPasswordError(''); setPasswordSuccess('')
        try {
            await changePassword(passwordForm)
            setPasswordSuccess('Password changed successfully!')
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            setPasswordError(err.response?.data?.message || err.response?.data || 'Failed to change password')
        } finally { setPasswordLoading(false) }
    }

    const PwInput = ({ name, value, show, setShow, placeholder }) => (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                name={name} value={value}
                onChange={handlePasswordChange}
                required placeholder={placeholder}
                className="ink-input w-full pr-10"
            />
            <button type="button" onClick={() => setShow(!show)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B5A2B] hover:text-[#1F1B16]">
                <EyeIcon open={show} />
            </button>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-2xl mx-auto px-4 md:px-6 py-10 w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/profile')} className="byline text-[#8B5A2B] hover:text-[#7A2E2E] text-xs">
                        ← Back to Profile
                    </button>
                </div>

                <div className="vintage-rule-thick mb-4"></div>
                <h1 className="text-3xl font-black text-[#1F1B16] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Edit Your Profile
                </h1>
                <p className="byline mb-6">Update your correspondent details</p>
                <div className="vintage-rule-thick mb-8"></div>

                {/* Profile form */}
                <div className="paper-card p-8 mb-6">
                    <h2 className="section-header mb-5">Correspondent Details</h2>

                    {/* Avatar row */}
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#E0D4C0]">
                        <div className="w-16 h-16 rounded-full border-2 border-[#8B5A2B] flex items-center justify-center" style={{ background: '#EADCC5' }}>
                            <span className="text-2xl font-black text-[#7A2E2E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <div>
                            <p className="font-bold text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>{user?.name}</p>
                            <p className="byline text-xs">{user?.email}</p>
                        </div>
                    </div>

                    {profileSuccess && (
                        <div className="border border-[#2E7D52] bg-[#F0FBF5] text-[#2E7D52] p-4 mb-5 text-sm flex items-center gap-2">
                            <span>✓</span> {profileSuccess}
                        </div>
                    )}
                    {profileError && (
                        <div className="border border-[#7A2E2E] bg-[#FBF0F0] text-[#7A2E2E] p-4 mb-5 text-sm flex items-center gap-2">
                            <span>⚠</span> {typeof profileError === 'string' ? profileError : 'Failed to update profile'}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="byline block mb-2">Full Name</label>
                            <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} required placeholder="Your full name" className="ink-input w-full" />
                        </div>
                        <div>
                            <label className="byline block mb-2">Username</label>
                            <input type="text" name="username" value={profileForm.username} onChange={handleProfileChange} placeholder="@username" className="ink-input w-full" />
                        </div>
                        <div>
                            <label className="byline block mb-2">Biography</label>
                            <textarea name="bio" value={profileForm.bio} onChange={handleProfileChange} rows={3} placeholder="Tell readers about yourself…" className="ink-input w-full resize-none" />
                        </div>
                        <div>
                            <label className="byline block mb-2">Country</label>
                            <select name="country" value={profileForm.country} onChange={handleProfileChange} className="ink-select w-full">
                                <option value="">Select country</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button type="submit" disabled={profileLoading} className="stamp-btn w-full py-3 text-sm tracking-widest mt-2">
                            {profileLoading ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Password form */}
                <div className="paper-card p-8">
                    <h2 className="section-header mb-5">Change Password</h2>

                    {passwordSuccess && (
                        <div className="border border-[#2E7D52] bg-[#F0FBF5] text-[#2E7D52] p-4 mb-5 text-sm flex items-center gap-2">
                            <span>✓</span> {passwordSuccess}
                        </div>
                    )}
                    {passwordError && (
                        <div className="border border-[#7A2E2E] bg-[#FBF0F0] text-[#7A2E2E] p-4 mb-5 text-sm flex items-center gap-2">
                            <span>⚠</span> {typeof passwordError === 'string' ? passwordError : 'Failed to change password'}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="byline block mb-2">Current Password</label>
                            <PwInput name="currentPassword" value={passwordForm.currentPassword} show={showCurrent} setShow={setShowCurrent} placeholder="Your current password" />
                        </div>
                        <div>
                            <label className="byline block mb-2">New Password</label>
                            <PwInput name="newPassword" value={passwordForm.newPassword} show={showNew} setShow={setShowNew} placeholder="Choose a new password" />
                        </div>
                        <div>
                            <label className="byline block mb-2">Confirm New Password</label>
                            <PwInput name="confirmPassword" value={passwordForm.confirmPassword} show={showConfirm} setShow={setShowConfirm} placeholder="Repeat new password" />
                        </div>
                        <button type="submit" disabled={passwordLoading} className="ink-btn w-full py-3 text-sm tracking-widest mt-2">
                            {passwordLoading ? 'Updating…' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}