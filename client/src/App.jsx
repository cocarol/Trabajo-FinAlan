import { Route, Routes, Navigate } from 'react-router-dom'

import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import PrivateRoute from "./components/PrivateRoute"
import MisTurnos from "./components/MisTurnos"
import BuscarYReservarTurno from "./components/BuscarYReservarTurno"
import CrearTurno from "./components/CrearTurno"
import RutaMedico from "./components/RutaMedico"
import PanelMedico from "./components/PanelMedico"
import FichaClinica from "./components/FichaClinica"
import VincularPaciente from "./components/VincularPaciente"
import RutaPaciente from "./components/RutaPaciente"
import EditarPerfil from './components/EditarPerfil'
import RutaAdmin from "./components/RutaAdmin"
import GestionRoles from "./components/GestionRoles"


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
      <Route element={<RutaMedico><PanelMedico /></RutaMedico>} path='/medico/panel' />
      <Route element={<RutaMedico><FichaClinica /></RutaMedico>} path='/medico/ficha/:pacienteId' />
      <Route element={<RutaMedico><VincularPaciente /></RutaMedico>} path='/medico/vincular' />
      <Route element={<RutaPaciente><BuscarYReservarTurno /></RutaPaciente>} path='/reservar' />
      <Route element={<EditarPerfil />} path="/perfil"/>
      <Route element={<RutaAdmin><GestionRoles /></RutaAdmin>} path='/admin/roles' />
    </Routes>
  )
}

export default App