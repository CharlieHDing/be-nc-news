const app = require("../server");
const request = require("supertest");
// const { toBeSortedBy } = require("jest-sorted");
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
      xdescribe('Invalid Methods',()=>{
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
          })
        })
        xdescribe('Invalid Methods',()=>{
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
          })
        })
      })
    })
    describe('/articles',()=>{
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
              expect(res.body.msg).toEqual("Whoops, invalid article request");
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
          test.only('PATCH 400 - bad request',()=>{
            return request(app)
            .patch('/api/articles/XXX')
            .send({ inc_votes: 20 })
            .expect(400)
            .then((res)=>{
              expect(res.body.msg).toEqual("Whoops, invalid article request");
            })
          })
          test("PATCH: 400 - invalid property name", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_vote: 30 })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe('Whoops, incorrect property name!');
              });
          });
          test("PATCH: 400 - invalid property value type", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: '40' })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe('Whoops, incorrect value type!');
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
        xdescribe('Invalid Methods',()=>{
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
          })
        })
        xdescribe('/comments',()=>{
          describe('POST comment',()=>{
            test('POST 201 - comment added',()=>{
              return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 123, body: 'this is awesome' })
              .expect(201)
              .then((res)=>{
                expect(res.body.comment).toEqual(
                  expect.objectContaining(
                    {
                      comment_id: expect.any(Number),
                      author: 123,
                      article_id: 1,
                      votes: 0,
                      body: 'this is awesome',
                      created_at: expect.any(String)
                    }
                  )
                );
              })
            })
          })
          xdescribe('Invalid Methods',()=>{
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
            })
          })
        })
      })
    })
  })
})
