const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');




// TODO: crear usuarios

const signup = async (req, res, next) => {

  const { name, email, password } = req.body

  try {

    // aqui reviso que el usuario no este registrado
    const newUser = await User.findOne({ email })

    if (newUser) {
      return res
        .status(400)
        .json({ mjs: 'El usuario ya se encuentra registrado!'})
    }

    // encriptar el password
    let passwordHashed = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: passwordHashed
    })

    // guardo el usuario
    await user.save()

    // creó y firmo el token
    const token = jsonwebtoken.sign(
      {
        id: user._id
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )

    res.status(201).json({
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ mjs: 'Error al tratar de crear al usuario.'})
  }
}


const login = async (req, res, next) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email: email })

    if (!user) {
      return res
        .status(400)
        .json({ mjs: 'Usuario no registrado!'})
    }

    let isPasswordCorrecto = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrecto) {
      return res
        .status(401)
        .json({ mjs: 'El password es incorrecto!'})
    }

    const token = jsonwebtoken.sign(
      {
        id: user._id
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )

    res.status(200).json({ token })

    
  } catch (error) {
    console.log(error)
    res.status(500).json({ mjs: 'Ocurrio un error'})
  }
}


const verifyToken = (req, res, next) => {

  console.log('req.headers: ', req.headers)
  const headers = req.headers[`x-auth-token`]
  console.log(headers)
  const token = headers

   if (!token) {
     res.status(404).json({ mjs: 'Token no encontrado!'})
   }

  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, user) =>  {
    if (err) {
      return res.status(400).json({ mjs: 'Token inválido!'})
    }

    req.id = user.id
   })
  
  // pasamos al siguiente middleware
  next()
}


const getUser = async (req, res, next) => {
  const user_id = req.id
  let user

  try {

    user = await User.findById({ _id: user_id}, '-password')

    if (!user) {
      return res.status(404).json({ mjs: 'Usuario no encontrado!'})
    }

    return res.status(200).json(user)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ mjs: 'Ocurrio un error'})
  }
}


exports.signup = signup
exports.login = login
exports.verifyToken = verifyToken
exports.getUser = getUser