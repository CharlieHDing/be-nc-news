const express = require('express')
const { getArticleById, editArticleById, postArticleComment, getArticleComments} = require('../controllers/articles.controller')
const { Error405 } = require('../errors/errors')

const articlesRouter = express.Router()

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(editArticleById)
.all(Error405)

articlesRouter.route('/:article_id/comments')
.post(postArticleComment)
.all(Error405)

module.exports = articlesRouter