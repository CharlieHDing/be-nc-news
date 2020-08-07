const { updateCommentById, removeCommentById} = require('../models/comments.model')

const patchCommentById = (req, res, next) => {
    updateCommentById(req).then((comment)=>{
            res.status(200).send({comment})
    })
    .catch(next)
}

const deleteCommentById = (req, res, next) => {
    removeCommentById(req).then((comment)=>{
            res.status(204).send({comment})
    })
    .catch(next)
}

module.exports = { patchCommentById, deleteCommentById }