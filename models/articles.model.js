const connection = require('../db/connection')

const fetchArticleById = (req)=>{
    const articleId = Number(req.params.article_id)
    return connection
    .select('articles.*')
    .from('articles')
    .count({comment_count:'comments.comment_id'})
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', articleId)
    .then((articleArr)=>{
        const article = articleArr[0]
        if (article === undefined) {
            return Promise.reject({status:404, msg:`No article found for article_id: ${articleId}` })
        } else {
            return article
        }
    })
}

const updateArticleById = (req)=>{
    return fetchArticleById(req).then((article)=>{
        const articleId = Number(req.params.article_id)
        const voteInc = req.body.inc_votes
        if (voteInc === undefined){
            return Promise.reject({status:400, msg:'Whoops, incorrect property name!'})
        } else if (typeof voteInc !== 'number'){
            return Promise.reject({status:400, msg:'Whoops, incorrect value type!'})
        } else {
            const updatedVotes = Number(article.votes) + voteInc
            return connection
            .from('articles')
            .where('article_id', articleId)
            .update('votes', updatedVotes)
            .returning('*')
            .then((articleArr)=>{
                const article = articleArr[0]
                    return article
            })
        }
    })
}

const addArticleComment = (req)=>{
    const articleId = Number(req.params.article_id)
    const comment = {}
    comment.author = req.body.username
    comment.article_id = articleId
    comment.body = req.body.body
    return connection
    .from('comments')
    .insert(comment)
    .where('article_id', articleId)
    .returning('*')
    .then((newCommentArr)=>{
        const newComment = newCommentArr[0]
        // if (newComment === undefined) {
        //     return Promise.reject({status:404, msg:`No comment found for comment_id: ${commentId}` })
        // } else {
            console.log(newComment)
            return newComment
        // }
    })
}

module.exports = { fetchArticleById, updateArticleById, addArticleComment }