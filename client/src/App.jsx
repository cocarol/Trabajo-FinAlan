import { Route, Routes, Link } from 'react-router-dom'

import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import PrivateRoute from "./components/PrivateRoute"

function App() {

  return (
    <>
      <h1>Mi Aplicación</h1>
      <div>
        <Link to="/login">Login</Link>
        <p></p>
        <Link to="/register">Registrarme</Link>
        <p></p>
        <Link to="/profile">Perfil</Link>
      </div>

      <Routes>
        <Route element={<Login />} path='/login' />
        <Route element={<Register />} path='/register' />
        <Route
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
          path='/profile'
        />
      </Routes>
    </>
  )
}

export default App