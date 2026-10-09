import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const submitRegister = async () => {
        setErrorMessage("")
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

    return (<>
        <h1>Registro</h1>

        {errorMessage && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
        )}

        <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submitRegister}>Registrarme</button>
    </>)
}

export default Register