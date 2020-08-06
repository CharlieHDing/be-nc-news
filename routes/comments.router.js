const express = require('express')
const { editCommentById, deleteCommentById} = require('../controllers/comments.controller')
const { Error405 } = require('../errors/errors')

const commentsRouter = express.Router()

commentsRouter.route('/:comment_id')
.patch(editCommentById)
.delete(deleteCommentById)
.all(Error405)

module.exports = commentsRouter