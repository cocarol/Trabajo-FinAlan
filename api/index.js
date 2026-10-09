const express = require("express")
const cors = require('cors')
const server = express()

const { sequelize } = require('./config/db')
const userRoutes = require('./routes/user.route')

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

server.use('/users', userRoutes)

server.listen(3000, async () => {
    await sequelize.authenticate()
    await sequelize.sync({ force: false })
    console.log("El Server esta ON");
})