import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const loginUser = (userData) => {
        if (!userData || !userData.token) {
            console.error('Login error: Missing token in userData', userData)
            return
        }
        console.log('Login successful, storing token and user data')
        localStorage.setItem('token', userData.token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        // Verify token was stored
        const storedToken = localStorage.getItem('token')
        console.log('Token stored and verified:', !!storedToken)
    }

    const logoutUser = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)