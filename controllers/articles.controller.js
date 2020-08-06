const { fetchArticleById, updateArticleById, addArticleComment, fetchArticleComments, fetchArticles} = require('../models/articles.model')

const getArticleById = (req, res, next) => {
    fetchArticleById(req).then((article)=>{
            res.status(200).send({article})
    })
    .catch(next)
}

const editArticleById = (req, res, next) => {
    updateArticleById(req).then((article)=>{
            res.status(201).send({article})
    })
    .catch(next)
}

const postArticleComment = (req, res, next) => {
    addArticleComment(req).then((comment)=>{
            res.status(201).send({comment})
    })
    .catch(next)
}

const getArticleComments = (req, res, next) => {
    fetchArticleComments(req.params.article_id, req.query)
    .then((comments)=>{
            res.status(200).send({comments})
    })
    .catch(next)
}

const getArticles = (req, res, next) => {
    fetchArticles(req.query).then((articles)=>{
        if (articles.length === 0) {
            res.status(204).send(null)
        } else res.status(200).send({articles})
    })
    .catch(next)
}

module.exports = { getArticleById, editArticleById, postArticleComment, getArticleComments, getArticles}