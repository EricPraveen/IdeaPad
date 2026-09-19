import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EditorialLayout from './components/EditorialLayout'
import CustomCursor from './components/CustomCursor'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import WritePost from './pages/WritePost'
import Profile from './pages/Profile'
import Bookmarks from './pages/Bookmarks'
import AdminDashboard from './pages/AdminDashboard'
import EditProfile from './pages/EditProfile'
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <Router>
      <CustomCursor />
      <EditorialLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/write" element={<WritePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </EditorialLayout>
    </Router>
  )
}

export default App
