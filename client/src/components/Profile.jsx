import { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Profile() {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchMe = async () => {
        const token = localStorage.getItem('token')

        try {
            const response = await axios.get('http://localhost:3000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUser(response.data)
        } catch (error) {
            localStorage.removeItem('token')
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        fetchMe()
    }, [])

    if (loading) return <p>Cargando...</p>

    return (
        <div>
            <h1>Mi perfil</h1>
            {user && (
                <>
                    <p>Nombre: {user.name}</p>
                    <p>Email: {user.email}</p>
                </>
            )}
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    )
}

export default Profile