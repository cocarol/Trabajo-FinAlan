import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function RutaPaciente({ children }) {
    const token = localStorage.getItem('token')
    if (!token) return <Navigate to="/login" />

    try {
        const decoded = jwtDecode(token)
        if (decoded.role === 'medico') {
            return <Navigate to="/medico/panel" />
        }
    } catch {
        return <Navigate to="/login" />
    }

    return children
}

export default RutaPaciente