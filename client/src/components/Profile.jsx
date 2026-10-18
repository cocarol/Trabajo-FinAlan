import { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"

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

    useEffect(() => {
        fetchMe()
    }, [])

    if (loading) return <p>Cargando...</p>

    return (
        <Layout>
            <h1>Mi perfil</h1>
            {user && (
                <div className="form-card" style={{ maxWidth: '420px' }}>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}
        </Layout>
    )
}

export default Profile