const express = require('express')
const topicsRouter = require('./topics.router')
const usersRouter = require('./users.router')
const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')
const { Error405 } = require('../errors/errors')
const listEndpoints = require('express-list-endpoints')


const apiRouter = express.Router()

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/users', usersRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.route('/')
.get((req, res, next) => {
        const endpoints = listEndpoints(apiRouter)
        res.status(200).send({endpoints})
})
.all(Error405)

module.exports = apiRouter