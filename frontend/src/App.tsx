import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import WatchList from './pages/WatchList'
import Login from './pages/login'
import Register from './pages/register'
import { RequireAuth } from './auth/RequireAuth'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Route>
      </Routes>

      <Footer />
    </>
  )
}

export default App
