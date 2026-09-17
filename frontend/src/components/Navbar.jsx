import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/')
    }

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all">
            <Link to="/" className="text-2xl font-extrabold text-gradient flex items-center gap-2">
                <img src="/favicon.png" alt="IdeaPad" className="w-8 h-8 object-contain rounded-md" /> IdeaPad
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/write" className="btn-gradient text-sm">
                            ✍️ Write Post
                        </Link>
                        <Link to="/bookmarks" className="text-slate-300 hover:text-indigo-400 text-sm font-medium transition-colors">
                            Bookmarks
                        </Link>
                        <Link to={`/profile`} className="text-slate-300 hover:text-indigo-400 text-sm font-medium transition-colors">
                            Profile
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                                Admin
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-slate-300 hover:text-red-400 text-sm font-medium transition-colors">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-300 hover:text-indigo-400 text-sm font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="btn-gradient text-sm">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}