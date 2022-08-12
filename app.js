const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const dbConnection = require('./config/db')

//const db_password = '63ACFGe6fz0fpPDj'
const app = express()

// conectarse a la base de datos
dbConnection()

// habilitar cors
app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173'}))

// porder enviar las cookies
app.use(cookieParser())

// habiliatar express json
app.use(express.json({ extended: true }))

app.use('/api', require('./routes'))

const port = process.env.PORT || 4001

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo correctamente en el puerto ${port}`)
})
