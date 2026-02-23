import { Link } from 'react-router-dom'

function AdminPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <img 
        src="/notfound.jpg" 
        alt="not found image" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '400px', 
          borderRadius: '12px', 
          boxShadow: 'var(--shadow-card)',
          margin: '2rem auto',
          display: 'block'
        }} 
      />
      <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
        Go back to Home
      </Link>
    </div>
  )
}

export default AdminPage