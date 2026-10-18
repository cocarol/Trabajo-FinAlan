import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      await axios.post('http://localhost:3000/users/register', {
        name: name,
        email: email,
        password: password
      })
      navigate('/login')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al registrarse")
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="form-card">
        <h1>Mi Aplicación</h1>
        <h2>Registrarme</h2>

        {errorMessage && <div className="mensaje-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primario" style={{ width: '100%' }}>
            Registrarme
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' }}>
          ¿Ya tenés cuenta? <Link to="/login" style={{ color: 'var(--verde-clinico)', fontWeight: 600 }}>Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register