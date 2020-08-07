const connection = require('../db/connection')

const updateCommentById = (req)=>{
    if(Object.keys(req.body).length !== 1 ){
        return Promise.reject({status:400, msg:'Whoops, invalid patch body!'})
    } else {
        const commentId = Number(req.params.comment_id)
        let voteInc = req.body.inc_votes
        if (voteInc === undefined || typeof voteInc !== 'number'){
            return Promise.reject({status:404, msg:'Whoops, invalid patch body!'})
        } else {
            return connection
            .from('comments')
            .where('comment_id', commentId)
            .increment('votes', voteInc)
            .returning('*')
            .then((commentArr)=>{
                const comment = commentArr[0]
                if (comment === undefined) {
                    return Promise.reject({status:404, msg:`No comment found for comment_id: ${commentId}` })
                } else {
                    return comment
                }
            })
        }
    }
}

const removeCommentById = (req)=>{
    const commentId = Number(req.params.comment_id)
    return connection
    .from('comments')
    .where('comment_id', commentId)
    .del()
    .then((count)=>{
        if (count === 0) {
            return Promise.reject({status:404, msg:`No comment found for comment_id: ${commentId}` })
        } else {
            return null
        }


    })
}

module.exports = { updateCommentById, removeCommentById}