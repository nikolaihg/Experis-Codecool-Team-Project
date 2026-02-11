import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import WatchList from './pages/WatchList'


function App() {
  return (
  <div className="app">
      <Header onSearch={(q) => console.log("Search:", q)} />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
