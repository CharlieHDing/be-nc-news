const express = require('express')
const { getTopics } = require('../controllers/topics.controller')
const { Error405 } = require('../errors/errors')

const topicsRouter = express.Router()

topicsRouter.route('/')
.get(getTopics)
.all(Error405)

module.exports = topicsRouter