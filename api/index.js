const express = require("express")
const cors = require('cors')
const bcrypt = require('bcrypt')

const server = express()
const { sequelize } = require('./config/db')
const userRoutes = require('./routes/user.route')
const turnoRoutes = require('./routes/turno.route')
const medicoRoutes = require('./routes/medico.route')
const adminRoutes = require('./routes/admin.route')
const catalogoRoutes = require('./routes/catalogo.route')
const User = require('./models/User.model')

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

server.use(express.json())
server.use('/medico', medicoRoutes)
server.use('/users', userRoutes)
server.use('/turnos', turnoRoutes)
server.use('/admin', adminRoutes)
server.use('/catalogo', catalogoRoutes)

server.listen(3000, async () => {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    console.log("El Server esta ON");


    // const hashedPassword = await bcrypt.hash('123', 10)
    // const [claudio] = await User.findOrCreate({
    //   where: {
    //     email: 'claudio@medico.com'
    //   },
    //   default: {
    //     name: 'Claudio Germán',
    //     email: 'claudio@medico.com',
    //     password: hashedPassword,
    //     role: 'medico',
    //     dni: '213312132'
    //   }
    // })

    // const [fava] = await User.findOrCreate({
    //   where: {
    //     email: 'fava@admin.com'
    //   },
    //   default: {
    //     name: 'María Fava',
    //     email: 'fava@admin.com',
    //     password: hashedPassword,

    //     role: 'admin',
    //     dni: '123456'
    //   }
    // })
    // console.log(claudio)
})

