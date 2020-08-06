const express = require('express')
const topicsRouter = require('./topics.router')
const usersRouter = require('./users.router')
const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')
const { Error405 } = require('../errors/errors')
const { getEndpoints } = require('../controllers/api.controller')

const apiRouter = express.Router()

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/users', usersRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.route('/')
.get(getEndpoints)
.all(Error405)

module.exports = apiRouter