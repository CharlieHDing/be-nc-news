const express = require('express')
const { getUserByUN } = require('../controllers/users.controller')
const { Error405 } = require('../errors/errors')

const usersRouter = express.Router()

usersRouter.route('/:username')
.get(getUserByUN)
.all(Error405)

module.exports = usersRouter