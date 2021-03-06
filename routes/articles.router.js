const express = require('express')
const { getArticleById, patchArticleById, postArticleComment, getArticleComments, getArticles} = require('../controllers/articles.controller')
const { Error405 } = require('../errors/errors')

const articlesRouter = express.Router()

articlesRouter.route('/')
.get(getArticles)
.all(Error405)

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)
.all(Error405)

articlesRouter.route('/:article_id/comments')
.post(postArticleComment)
.get(getArticleComments)
.all(Error405)

module.exports = articlesRouter