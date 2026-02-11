import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import WatchList from './pages/WatchList'
import Login from './pages/login'
import Register from './pages/register'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/watchlist" element={<WatchList />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
