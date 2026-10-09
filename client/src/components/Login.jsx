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
            setErrorMessage(error.response?.data?.message || "Error al iniciar sesión")
        }
    }

    return (<>
        <h1>Login</h1>

        {errorMessage && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
        )}

        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submitLogin}>Ingresar</button>
    </>)
}

export default Login