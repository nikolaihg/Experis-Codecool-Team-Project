import './App.css'
import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { RequireAdmin } from './auth/RequireAdmin'

import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { ProfileMenu } from './components/Header/ProfileMenu'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import WatchListsPage from './pages/WatchListsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'


function App() {
  return (
    <>
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />}></Route>

          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/watchlist" element={<WatchListsPage />} />
            <Route path="/profilemenu" element={<ProfileMenu />} />
            <Route path="/profile" element={<ProfilePage />} />
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
