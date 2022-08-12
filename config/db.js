const mongoose = require('mongoose')
require('dotenv').config()


const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Conección a la base de datos exitosa!!')
  } catch (error) {
    console.log('Ocurrio un error al realizar la conneción a la DB!!')
    process.exit(1)
  }
}

module.exports = dbConnection
