import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
    "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Holy See", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq",
    "Ireland", "Israel", "Italy", "Jamaica", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
    "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', username: '',
        gender: '', country: '', dateOfBirth: ''
    })
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
            const data = await register(form)
            loginUser(data)
            navigate('/')
        } catch (err) {
            console.error('Registration Error:', err)
            if (err.response?.data?.message) setError(err.response.data.message)
            else if (err.response && typeof err.response.data === 'string') setError(err.response.data)
            else setError(err.message || 'Registration failed. Please try again.')
        }
    }

    const inputClass = "ink-input w-full"
    const selectClass = "ink-select w-full"

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-6 py-12">
                <div className="w-full max-w-2xl ink-reveal">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="vintage-rule-double mb-4"></div>
                        <h1 className="text-3xl font-black text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Join the Press
                        </h1>
                        <p className="typewriter-text text-[#8B5A2B] text-sm mt-2">
                            Become a correspondent at IdeaPad
                        </p>
                        <div className="vintage-rule-double mt-4"></div>
                    </div>

                    <div className="paper-card p-8">
                        {error && (
                            <div className="border border-[#7A2E2E] bg-[#FBF0F0] text-[#7A2E2E] p-4 mb-6 text-sm flex items-center gap-3">
                                <span>⚠</span>
                                <span style={{ fontFamily: "'IBM Plex Serif', serif" }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="byline block mb-2">Full Name</label>
                                    <input
                                        type="text" name="name" value={form.name}
                                        onChange={handleChange} required
                                        placeholder="Your full name"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="byline block mb-2">Username</label>
                                    <input
                                        type="text" name="username" value={form.username}
                                        onChange={handleChange} required
                                        placeholder="@yourname"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="byline block mb-2">Email Address</label>
                                    <input
                                        type="email" name="email" value={form.email}
                                        onChange={handleChange} required
                                        placeholder="you@example.com"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="byline block mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password" value={form.password}
                                            onChange={handleChange} required
                                            placeholder="Choose a strong password"
                                            className={`${inputClass} pr-10`}
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
                                <div>
                                    <label className="byline block mb-2">Date of Birth</label>
                                    <input
                                        type="date" name="dateOfBirth" value={form.dateOfBirth}
                                        onChange={handleChange} required
                                        className={`${inputClass} [&::-webkit-calendar-picker-indicator]:opacity-50`}
                                    />
                                </div>
                                <div>
                                    <label className="byline block mb-2">Gender</label>
                                    <select
                                        name="gender" value={form.gender}
                                        onChange={handleChange} required
                                        className={selectClass}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="byline block mb-2">Country of Origin</label>
                                    <select
                                        name="country" value={form.country}
                                        onChange={handleChange} required
                                        className={selectClass}
                                    >
                                        <option value="">Select country</option>
                                        {countries.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="stamp-btn w-full py-3 text-sm tracking-widest mt-2">
                                Enlist as Correspondent
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-[#E0D4C0] text-center">
                            <p className="typewriter-text text-xs text-[#8B5A2B]">
                                Already a member?{' '}
                                <Link to="/login" className="text-[#7A2E2E] font-semibold hover:underline">
                                    Sign in here
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