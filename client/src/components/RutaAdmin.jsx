import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function RutaAdmin({ children }) {
    const token = localStorage.getItem('token')

    if (!token) return <Navigate to="/login" />

    try {
        if (jwtDecode(token).role !== 'admin') {
            return <Navigate to="/mis-turnos" />
        }
    } catch (error) {
        return <Navigate to="/login" />
    }

    return children
}

export default RutaAdmin