import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'

import Home from './pages/Home'
import About from './pages/About'
import WatchList from './pages/WatchList'
import Login from './pages/login'
import Register from './pages/register'
import { RequireAuth } from './auth/RequireAuth'
import { RequireAdmin } from './auth/RequireAdmin'
import Profile from './pages/Profile' 
import { ProfileMenu } from './components/Header/ProfileMenu'

import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <>
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />}></Route>

          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/profilemenu" element={<ProfileMenu />} />
            <Route path="/profile" element={<Profile />} /> 
          </Route>

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
