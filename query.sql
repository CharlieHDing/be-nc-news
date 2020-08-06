\c nc_news_test

-- SELECT articles.*, COUNT (comments) AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- WHERE articles.article_id = 1
-- GROUP BY articles.article_id;

SELECT *
FROM comments
WHERE article_id = 1;

