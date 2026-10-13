
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function Layout({ children }) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <h1 className="app-title">Mi Aplicación</h1>
        {children}
      </section>
    </main>
  )
}

function LoginPage() {
  return (
    <Layout>
      <h2>Iniciar sesión</h2>
      <Login />
      <p className="auth-switch">
        ¿No tenés cuenta? <Link to="/register">Registrarme</Link>
      </p>
    </Layout>
  )
}

function RegisterPage() {
  return (
    <Layout>
      <h2>Registrarme</h2>
      <Register />
      <p className="auth-switch">
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </Layout>
  )
}

function ProfilePage() {
  return (
    <Layout>
      <h2>Mi perfil</h2>
      <Profile />
      <p className="auth-switch">
        <Link to="/login">Volver al login</Link>
      </p>
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App
