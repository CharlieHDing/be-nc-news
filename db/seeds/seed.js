const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {

  return knex
  .migrate.rollback()
  .then(()=>knex.migrate.latest())
  .then(()=> {
    return knex('topics')
    .insert(topicData)
    .returning('*')
  })
  .then(()=>{
    return knex('users')
    .insert(userData)
    .returning('*')
  })
  .then(()=>{
    const formArticleData = formatDates(articleData, 'created_at')
    return knex('articles')
    .insert(formArticleData)
    .returning('*')
    .then((formArticleData)=>{
      const formCommentData = formatComments(commentData,formArticleData)
      return knex('comments')
      .insert(formCommentData)
      .returning('*')
    })
  })
};
