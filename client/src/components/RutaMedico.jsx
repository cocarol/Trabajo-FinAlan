import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function RutaMedico({ children }) {
    const token = localStorage.getItem('token')

    if (!token) return <Navigate to="/login" />

    try {
        const decoded = jwtDecode(token)
        if (decoded.role !== 'medico') {
            return <Navigate to="/mis-turnos" />
        }
    } catch (error) {
        return <Navigate to="/login" />
    }

    return children
}

export default RutaMedico