const express = require('express')
const { signup, login, verifyToken, getUser } = require('../controllers/userController')

const router = express.Router()


// TODO: http://localhost:4001/api/auth   =>  GET, POST, DELETE, PUT

router.post('/signup', signup)
router.post('/login', login )
router.get('/', verifyToken, getUser)

module.exports = router
