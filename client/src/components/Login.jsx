import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const submitLogin = async () => {
        setErrorMessage("")
        try {
            const response = await axios.post('http://localhost:3000/users/login', {
                email: email,
                password: password
            })
            localStorage.setItem('token', response.data.token)
            navigate('/profile')
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Usuario o contraseña incorrectos")
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-card">
                <h1>Bienvenido de nuevo</h1>
                <p style={{ color: 'var(--tinta-suave)', marginBottom: '24px' }}>Ingresá para gestionar tus turnos</p>

                {errorMessage && <div className="mensaje-error">{errorMessage}</div>}

                <div className="form-field">
                    <label>Email</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-field">
                    <label>Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className="btn-primario" onClick={submitLogin} style={{ width: '100%' }}>
                    Ingresar
                </button>
            </div>
        </div>
    )
}

export default Login