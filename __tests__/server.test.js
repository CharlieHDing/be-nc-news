const app = require("../server");
const request = require("supertest");
const toBeSortedBy = require("jest-sorted");
const connection = require('../db/connection')

describe("/", () => {
  beforeEach(()=>{
    return connection.seed.run()
  })
  afterAll(()=>{
    return connection.destroy()
  })
  test("GET 404 - Invalid path", () => {
    return request(app)
      .get("/asdfghj")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Whoops, invalid path!");
      });
  });
  describe('/api',()=>{
    describe('/topics',()=>{
      describe('GET topics',()=>{
        test('GET 200 - all topics returned',()=>{
            return request(app).get('/api/topics').expect(200).then((res)=>{
                res.body.topics.forEach(topic=>{
                    expect(topic).toEqual(
                      expect.objectContaining(
                        {
                          slug: expect.any(String),
                          description: expect.any(String)
                        }
                      )
                    );
                  })
            })
        })
      })
      describe('Invalid Methods',()=>{
        test('Error 405 - invalid method',()=>{
          const invalidMethods = ['put', 'post', 'patch', 'delete']
          const promises = invalidMethods.map((method)=>{
            return request(app)
            [method]('/api/topics')
            .expect(405)
            .then((res)=>{
              expect(res.body.msg).toBe("Invalid method!")
            })
          })
          return Promise.all(promises)
        })
      })
    })
    describe('/users',()=>{
      describe('/:username',()=>{
        describe('GET User',()=>{
          test('GET 200 - user returned',()=>{
              return request(app).get('/api/users/lurker').expect(200).then((res)=>{
                expect(res.body.user).toEqual(
                    {
                      username: "lurker",
                      avatar_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                      name: "do_nothing",
                    }
                );
              })
          })
          test('GET 404 - page not found',()=>{
            return request(app).get('/api/users/charlie').expect(404).then((res)=>{
              expect(res.body.msg).toEqual("No user found for username: charlie");
            })
          })
        })
        describe('Invalid Methods',()=>{
          test('Error 405 - invalid method',()=>{
            const invalidMethods = ['put', 'post', 'patch', 'delete']
            const promises = invalidMethods.map((method)=>{
              return request(app)
              [method]('/api/users/lurker')
              .expect(405)
              .then((res)=>{
                expect(res.body.msg).toBe("Invalid method!")
              })
            })
            return Promise.all(promises)
          })
        })
      })
    })
    describe('/articles',()=>{
      describe('GET articles',()=>{
        test('GET 200 - articles returned sorted by created_at in descending order',()=>{
            return request(app).get('/api/articles').expect(200).then((res)=>{
              res.body.articles.forEach((article)=>{
                expect(article).toEqual(
                  expect.objectContaining(
                    {
                      article_id: expect.any(Number),
                      title: expect.any(String),
                      body: expect.any(String),
                      votes: expect.any(Number),
                      topic: expect.any(String),
                      author: expect.any(String),
                      created_at: expect.any(String),
                      comment_count: expect.any(String)
                    }
                  )
                );
              })
              expect(res.body.articles).toBeSortedBy("created_at", {coerce:true, descending:true})
            })
        })
        test('GET 200 - articles returned sorted by article_id in ascending order',()=>{
          return request(app).get('/api/articles?sort_by=article_id&&order=asc').expect(200).then((res)=>{
            res.body.articles.forEach((article)=>{
              expect(article).toEqual(
                expect.objectContaining(
                  {
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    comment_count: expect.any(String)
                  }
                )
              );
            })
          expect(res.body.articles).toBeSortedBy("article_id", {coerce:true, ascending:true})
          })
        })
        test('GET 200 - articles returned filtered by author in descending order',()=>{
          return request(app).get('/api/articles?author=rogersop').expect(200).then((res)=>{
            res.body.articles.forEach((article)=>{
              expect(article).toEqual(
                expect.objectContaining(
                  {
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    topic: expect.any(String),
                    author: 'rogersop',
                    created_at: expect.any(String),
                    comment_count: expect.any(String)
                  }
                )
              );
            })
          expect(res.body.articles).toBeSortedBy("created_at", {coerce:true, descending:true})
          })
        })
        test('GET 200 - articles returned filtered by topic, sorted by article_id in ascending order',()=>{
          return request(app).get('/api/articles?topic=mitch&&sort_by=article_id&&order=asc').expect(200).then((res)=>{
            res.body.articles.forEach((article)=>{
              expect(article).toEqual(
                expect.objectContaining(
                  {
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    topic: 'mitch',
                    author: expect.any(String),
                    created_at: expect.any(String),
                    comment_count: expect.any(String)
                  }
                )
              );
            })
          expect(res.body.articles).toBeSortedBy("article_id", {coerce:true, ascending:true})
          })
        })
        test('GET 204 - No articles matching filter',()=>{
          return request(app).get('/api/articles?topic=charlie').expect(204)
        })
        test('GET 400 - undefined colum',()=>{
          return request(app)
          .get('/api/articles?sort_by=vote')
          .expect(400)
          .then((res)=>{
            expect(res.body.msg).toBe('Whoops, undefined column!');
          })
        })
        test('GET 400 - invalid order entry',()=>{
          return request(app)
          .get('/api/articles?sort_by=comment_id&&order=des')
          .expect(400)
          .then((res)=>{
            expect(res.body.msg).toBe('Whoops, invalid order entry!');
          })
        })
        test('GET 400 - invalid filter',()=>{
          return request(app)
          .get('/api/articles?author=charlie&&sort_by=comment_id&&order=desc')
          .expect(400)
          .then((res)=>{
            expect(res.body.msg).toBe('Whoops, invalid filter value!');
          })
        })
      })
      describe('/:article_id',()=>{
        describe('GET article',()=>{
          test('GET 200 - article returned',()=>{
              return request(app).get('/api/articles/1').expect(200).then((res)=>{
                expect(res.body.article).toEqual(
                  expect.objectContaining(
                    {
                      article_id: 1,
                      title: expect.any(String),
                      body: expect.any(String),
                      votes: expect.any(Number),
                      topic: expect.any(String),
                      author: expect.any(String),
                      created_at: expect.any(String),
                      comment_count: expect.any(String)
                    }
                  )
                );
              })
          })
          test('GET 400 - bad request',()=>{
            return request(app).get('/api/articles/XXX').expect(400).then((res)=>{
              expect(res.body.msg).toEqual("Whoops, invalid request");
            })
          })
          test('GET 404 - page not found',()=>{
            return request(app).get('/api/articles/999').expect(404).then((res)=>{
              expect(res.body.msg).toEqual("No article found for article_id: 999");
            })
          })
        })
        describe('PATCH article',()=>{
          test('PATCH 201 - article updated',()=>{
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -10 })
            .expect(201)
            .then((res)=>{
              expect(res.body.article).toEqual(
                expect.objectContaining(
                  {
                    article_id: 1,
                    title: expect.any(String),
                    body: expect.any(String),
                    votes: 90,
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String)
                  }
                )
              );
            })
          })
          test("PATCH: 201 - invalid property name", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_vote: 30 })
              .expect(201)
              .then((res) => {
                expect(res.body.article).toEqual(
                  expect.objectContaining(
                    {
                      article_id: 1,
                      title: expect.any(String),
                      body: expect.any(String),
                      votes: 100,
                      topic: expect.any(String),
                      author: expect.any(String),
                      created_at: expect.any(String)
                    }
                  )
                );
              });
          });
          test("PATCH: 201 - invalid property value type", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: '40' })
              .expect(201)
              .then((res) => {
                expect(res.body.article).toEqual(
                  expect.objectContaining(
                    {
                      article_id: 1,
                      title: expect.any(String),
                      body: expect.any(String),
                      votes: 100,
                      topic: expect.any(String),
                      author: expect.any(String),
                      created_at: expect.any(String)
                    }
                  )
                );
              });
          });
          test('PATCH 400 - bad request',()=>{
            return request(app)
            .patch('/api/articles/XXX')
            .send({ inc_votes: 20 })
            .expect(400)
            .then((res)=>{
              expect(res.body.msg).toEqual("Whoops, invalid request");
            })
          })
          test("PATCH: 400 - invalid patch body", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 40, article_id: 1 })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe('Whoops, invalid patch body!');
              });
          });
          test('PATCH 404 - page not found',()=>{
            return request(app)
            .patch('/api/articles/999')
            .send({ inc_votes: 50 })
            .expect(404)
            .then((res)=>{
              expect(res.body.msg).toEqual("No article found for article_id: 999");
            })
          })
        })
        describe('Invalid Methods',()=>{
          test('Error 405 - invalid method',()=>{
            const invalidMethods = ['put', 'post', 'delete']
            const promises = invalidMethods.map((method)=>{
              return request(app)
              [method]('/api/articles/1')
              .expect(405)
              .then((res)=>{
                expect(res.body.msg).toBe("Invalid method!")
              })
            })
            return Promise.all(promises)
          })
        })
        describe('/comments',()=>{
          describe('POST comment',()=>{
            test('POST 201 - comment added',()=>{
              return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 'rogersop', body: 'this is awesome' })
              .expect(201)
              .then((res)=>{
                expect(res.body.comment).toEqual(
                  expect.objectContaining(
                    {
                      comment_id: expect.any(Number),
                      author: 'rogersop',
                      article_id: 1,
                      votes: 0,
                      body: 'this is awesome',
                      created_at: expect.any(String)
                    }
                  )
                );
              })
            })
            test('POST 400 - invalid user',()=>{
              return request(app)
              .post('/api/articles/1/comments')
              .send({ username: '123', body: 'this is awesome' })
              .expect(400)
              .then((res)=>{
                expect(res.body.msg).toBe('Whoops, invalid user!');
              })
            })
            test('POST 400 - invalid property',()=>{
              return request(app)
              .post('/api/articles/1/comments')
              .send({ userName: 'rogersop', body: 'this is awesome' })
              .expect(400)
              .then((res)=>{
                expect(res.body.msg).toBe('Whoops, invalid property!');
              })
            })
          })
          describe('GET comments',()=>{
            test('GET 200 - all comments returned sorted by default in ascending order',()=>{
              return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then((res)=>{
                res.body.comments.forEach((comment)=>{
                  expect(comment).toEqual(
                    expect.objectContaining(
                      {
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        body: expect.any(String),
                        created_at: expect.any(String)
                      }
                    )
                  )
                })
                expect(res.body.comments).toBeSortedBy("created_at", {coerce:true, ascending:true})
              })
            })
            test('GET 200 - all comments returned sorted by votes in ascending order',()=>{
              return request(app)
              .get('/api/articles/1/comments?sort_by=votes')
              .expect(200)
              .then((res)=>{
                res.body.comments.forEach((comment)=>{
                  expect(comment).toEqual(
                    expect.objectContaining(
                      {
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        body: expect.any(String),
                        created_at: expect.any(String)
                      }
                    )
                  )
                })
                expect(res.body.comments).toBeSortedBy("votes", {coerce:true, ascending:true})
              })
            })
            test('GET 200 - all comments returned sorted by default in descending order',()=>{
              return request(app)
              .get('/api/articles/1/comments?order=desc')
              .expect(200)
              .then((res)=>{
                res.body.comments.forEach((comment)=>{
                  expect(comment).toEqual(
                    expect.objectContaining(
                      {
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        body: expect.any(String),
                        created_at: expect.any(String)
                      }
                    )
                  )
                })
                expect(res.body.comments).toBeSortedBy("created_at", {coerce:true, ascending:false})
              })
            })
            test('GET 200 - all comments returned sorted by votes in descending order',()=>{
              return request(app)
              .get('/api/articles/1/comments?sort_by=votes&&order=desc')
              .expect(200)
              .then((res)=>{
                res.body.comments.forEach((comment)=>{
                  expect(comment).toEqual(
                    expect.objectContaining(
                      {
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        body: expect.any(String),
                        created_at: expect.any(String)
                      }
                    )
                  )
                })
                expect(res.body.comments).toBeSortedBy("votes", {coerce:true, descending:true})
              })
            })
            test('GET 400 - invalid article_id',()=>{
              return request(app)
              .get('/api/articles/999/comments')
              .expect(400)
              .then((res)=>{
                expect(res.body.msg).toBe('Whoops, invalid article!');
              })
            })
            test('GET 400 - undefined colum',()=>{
              return request(app)
              .get('/api/articles/1/comments?sort_by=vote')
              .expect(400)
              .then((res)=>{
                expect(res.body.msg).toBe('Whoops, undefined column!');
              })
            })
            test('GET 400 - invalid order entry',()=>{
              return request(app)
              .get('/api/articles/1/comments?sort_by=comment_id&&order=des')
              .expect(400)
              .then((res)=>{
                expect(res.body.msg).toBe('Whoops, invalid order entry!');
              })
            })
          })
          describe('Invalid Methods',()=>{
            test('Error 405 - invalid method',()=>{
              const invalidMethods = ['put', 'patch', 'delete']
              const promises = invalidMethods.map((method)=>{
                return request(app)
                [method]('/api/articles/1/comments')
                .expect(405)
                .then((res)=>{
                  expect(res.body.msg).toBe("Invalid method!")
                })
              })
              return Promise.all(promises)
            })
          })
        })
      })
    })
    describe('Invalid Methods',()=>{
      test('Error 405 - invalid method',()=>{
        const invalidMethods = ['put', 'patch', 'post', 'delete']
        const promises = invalidMethods.map((method)=>{
          return request(app)
          [method]('/api/articles')
          .expect(405)
          .then((res)=>{
            expect(res.body.msg).toBe("Invalid method!")
          })
        })
        return Promise.all(promises)
      })
    })
  })
  describe('/comments',()=>{
    describe('/:comment_id',()=>{
      describe('PATCH comment',()=>{
        test('PATCH 201 - comment updated',()=>{
          return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: -10 })
          .expect(201)
          .then((res)=>{
            expect(res.body.comment).toEqual(
              expect.objectContaining(
                {
                  comment_id: 1,
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  votes: 6,
                  body: expect.any(String),
                  created_at: expect.any(String)
                }
              )
            );
          })
        })
        test("PATCH: 201 - invalid property name", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_vote: 30 })
            .expect(201)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining(
                  {
                    comment_id: 1,
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    votes: 16,
                    body: expect.any(String),
                    created_at: expect.any(String)
                  }
                )
              );
            });
        });
        test("PATCH: 201 - invalid property value type", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: '40' })
            .expect(201)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining(
                  {
                    comment_id: 1,
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    votes: 16,
                    body: expect.any(String),
                    created_at: expect.any(String)
                  }
                )
              );
            });
            
        });
        test('PATCH 400 - bad request',()=>{
          return request(app)
          .patch('/api/comments/XXX')
          .send({ inc_votes: 20 })
          .expect(400)
          .then((res)=>{
            expect(res.body.msg).toEqual("Whoops, invalid request");
          })
        })
        test("PATCH: 400 - invalid patch body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 40, article_id: 1 })
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe('Whoops, invalid patch body!');
            });
        });
        test('PATCH 404 - page not found',()=>{
          return request(app)
          .patch('/api/comments/999')
          .send({ inc_votes: 50 })
          .expect(404)
          .then((res)=>{
            expect(res.body.msg).toEqual("No comment found for comment_id: 999");
          })
        })
      })
      describe('DELETE comment',()=>{
        test('DELETE 204 - comment updated',()=>{
          return request(app)
          .delete('/api/comments/1')
          .expect(204)
        })
        test('DELETE 400 - bad request',()=>{
          return request(app)
          .delete('/api/comments/XXX')
          .expect(400)
          .then((res)=>{
            expect(res.body.msg).toEqual("Whoops, invalid request");
          })
        })
        test('DELETE 404 - page not found',()=>{
          return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then((res)=>{
            expect(res.body.msg).toEqual("No comment found for comment_id: 999");
          })
        })
      })
      describe('Invalid Methods',()=>{
        test('Error 405 - invalid method',()=>{
          const invalidMethods = ['put', 'get', 'post']
          const promises = invalidMethods.map((method)=>{
            return request(app)
            [method]('/api/comments/2')
            .expect(405)
            .then((res)=>{
              expect(res.body.msg).toBe("Invalid method!")
            })
          })
          return Promise.all(promises)
        })
      })
    })
  })
})
