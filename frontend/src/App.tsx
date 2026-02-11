import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'

import Home from './pages/Home'
import About from './pages/About'
import WatchList from './pages/WatchList'
import Login from './pages/login'
import Register from './pages/register'
import NotFound from './components/NotFound'

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
        <Route path="*" element={<NotFound />}></Route>
      </ Routes>

      <Footer />
    </>
  )
}

export default App
