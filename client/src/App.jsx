import { Route, Routes, Navigate } from 'react-router-dom'

import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import PrivateRoute from "./components/PrivateRoute"
import MisTurnos from "./components/MisTurnos"
import BuscarYReservarTurno from "./components/BuscarYReservarTurno"
import CrearTurno from "./components/CrearTurno"

function App() {
  return (
    <Routes>
      <Route element={<Navigate to="/mis-turnos" />} path='/' />
      <Route element={<Login />} path='/login' />
      <Route element={<Register />} path='/register' />
      <Route element={<PrivateRoute><Profile /></PrivateRoute>} path='/profile' />
      <Route element={<PrivateRoute><MisTurnos /></PrivateRoute>} path='/mis-turnos' />
      <Route element={<PrivateRoute><BuscarYReservarTurno /></PrivateRoute>} path='/reservar' />
      <Route element={<PrivateRoute><CrearTurno /></PrivateRoute>} path='/crear-turno' />
    </Routes>
  )
}

export default App