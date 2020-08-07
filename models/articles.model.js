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
    if(Object.keys(req.body).length !== 1 ){
        return Promise.reject({status:400, msg:'Whoops, invalid patch body!'})
    } else {
        const articleId = Number(req.params.article_id)
        let voteInc = req.body.inc_votes
        if (voteInc === undefined || typeof voteInc !== 'number'){
            return Promise.reject({status:404, msg:'Whoops, invalid patch body!'})
        } else {
            return connection
            .from('articles')
            .where('article_id', articleId)
            .increment('votes', voteInc)
            .returning('*')
            .then((articleArr)=>{
                const article = articleArr[0]
                if (article === undefined) {
                    return Promise.reject({status:404, msg:`No article found for article_id: ${articleId}` })
                } else {
                    return article
                }
            })
        }
    }
}

const addArticleComment = (req)=>{
    const articleId = Number(req.params.article_id)
    const comment = {}
    comment.author = req.body.username
    comment.article_id = articleId
    comment.body = req.body.body
    if (comment.author === undefined || comment.body === undefined){
        return Promise.reject({status:400, msg:'Whoops, invalid property!'})
    } else {
        return connection
        .from('comments')
        .insert(comment)
        .where('article_id', articleId)
        .returning('*')
        .then((newCommentArr)=>{
            const newComment = newCommentArr[0]
            if (newComment === undefined) {
                return Promise.reject({status:400, msg:'error' })
            } else return newComment
        })
    }
}

const fetchArticleComments = (article_id, {sort_by = "created_at", order = "desc"})=>{ 
    if (order === 'asc' || order === 'desc') {
        return connection
        .select('*')
        .from('comments')
        .orderBy(sort_by, order)
        .where('article_id', article_id)
        .then((comments)=>{
            if (comments.length === 0) {
                return Promise.reject({status:400, msg:'Whoops, invalid article!' })
            } else {
                return comments}
        })
    }
    else {
        return Promise.reject({status:400, msg:'Whoops, invalid order entry!' })
    }
}

const fetchArticles = ({sort_by = 'created_at', order = 'desc', author, topic})=>{
    if (order === 'asc' || order === 'desc') {
    const whereQuery = (queryBuilder) => {
        if (author !== undefined) queryBuilder.where('articles.author',author)
        if (topic !== undefined) queryBuilder.where('articles.topic',topic)
    }
    return connection
    .select('articles.*')
    .from('articles')
    .orderBy(sort_by, order)
    .count({comment_count:'comments.comment_id'})
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .modify(whereQuery)
    .then((articlesArr)=>{
        return articlesArr
    })
    } else {
        return Promise.reject({status:400, msg:'Whoops, invalid order entry!' })
    }
}

module.exports = { fetchArticleById, updateArticleById, addArticleComment, fetchArticleComments, fetchArticles }