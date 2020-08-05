const { fetchArticleById, updateArticleById, addArticleComment} = require('../models/articles.model')

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
module.exports = { getArticleById, editArticleById, postArticleComment}