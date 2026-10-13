import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
            const response = await axios.post('http://localhost:3000/users/login', {
                email: email,
                password: password
            })
            localStorage.setItem('token', response.data.token)
            navigate('/profile')
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error al iniciar sesión")
        }
    }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">
        Iniciar sesión
      </button>
    </form>
  )
}

export default Login
