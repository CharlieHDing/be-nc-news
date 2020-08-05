const {
  formatDates,
  makeRefObj,
  formatComments,
  renameKeys
} = require('../db/utils/utils');

describe('formatDates', () => {
  test('returns an empty array when given an empty array',()=>{
    expect(formatDates([])).toEqual([])
  })
   test('changes the "created_at" property from a number to a JS date object',()=>{
   const input = [{
    title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100,
  }]
  const output = formatDates(input, 'created_at')
   expect(output[0].created_at).toBeInstanceOf(Date)
   })
   test('changes multiple dates from a number to a JS date object',()=>{
    const input = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    },
    {
      title: 'Sony Vaio; or, The Laptop',
      topic: 'mitch',
      author: 'icellusedkars',
      body:
        'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
      created_at: 1416140514171,
    },
    {
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: 1289996514171,
    }]
    const output = formatDates(input, 'created_at')
    output.forEach(object=>{
      expect(object.created_at).toBeInstanceOf(Date)
    })
    })
    test('doesnt mutate original array',()=>{
      const input = [{
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      }]
      formatDates(input, 'created_at')
        expect(input).toEqual([{
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100,
        },
        {
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body:
            'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
          created_at: 1416140514171,
        },
        {
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: 1289996514171,
        }])
      })
});

describe('makeRefObj', () => {
    test('returns an empty object, when passed an empty array', () => {
      const input = [];
      const actual = makeRefObj(input);
      const expected = {};
      expect(actual).toEqual(expected);
    });
    test('creates a reference object for a single item',() => {
      const articles = [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      }];
      expect(makeRefObj(articles, 'title', 'article_id')).toEqual({
        'Living in the shadow of a great man': 1,
      })
    })
    test('creates a reference object for multiple items',() => {
      const articles = [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
      {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      }];
      expect(makeRefObj(articles, 'title', 'article_id')).toEqual({
        'Living in the shadow of a great man': 1,
        'Sony Vaio; or, The Laptop': 2,
        'Eight pug gifs that remind me of mitch': 3
      })
    })
    test('doesnt mutate original array',()=>{
      const input = [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
      {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      }]
      makeRefObj(input, 'created_at')
        expect(input).toEqual([{
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100,
        },
        {
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body:
            'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
          created_at: 1416140514171,
        },
        {
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: 1289996514171,
        }])
      })
  });

describe('formatComments', () => {
  const comments = [{
    body:
      "body 1",
    belongs_to: "title 1",
    created_by: 'writer 1',
    votes: 1,
    created_at: 1511354163389,
  },
  {
    body:
      "body 2",
    belongs_to: "title 2",
    created_by: 'writer 2',
    votes: 2,
    created_at: 1479818163389,
  },
  {
    body:
      "body 3",
    belongs_to: "title 2",
    created_by: 'writer 3',
    votes: 3,
    created_at: 1448282163389,
  }];
  const articleData = [{
      article_id: 1,
      title: "title 1",
      body: 'body 1',
      votes: 1,
      topic: 'topic 1',
      author: 'writer 1',
      created_at: '+048600-09-05T11:13:09.000Z'
    },
    {
      article_id: 2,
      title: "title 2",
      body: 'body 2',
      votes: 2,
      topic: 'topic 2',
      author: 'writer 2',
      created_at: '+049521-08-16T12:47:36.000Z'
    },
    {
      article_id: 3,
      title: "title 3",
      body: 'body 3',
      votes: 3,
      topic: 'topic 3',
      author: 'writer 3',
      created_at: '+049524-01-05T22:52:26.000Z'
    }]
  test('returns an empty array, when passed an empty array', () => {
    const input = [];
    const actual = formatComments(input, articleData);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  test('changes the "created_at" property from a number to a JS date object',()=>{
    const output = formatComments(comments,articleData)
    output.forEach(object=>{
      expect(object.created_at).toBeInstanceOf(Date)
    })
  });
  test('renames the created_by property to author',() => {
    const output = formatComments(comments,articleData)
    output.forEach(comment=>{
      expect(comment).toHaveProperty('author')
    })
  })
  test('renames the belongs_to property to article_id',() => {
    const output = formatComments(comments,articleData)
    output.forEach(comment=>{
      console.log(output)
      expect(comment).toHaveProperty('article_id')
  })
});
test('has correct article_id value',() => {
  const output = formatComments(comments,articleData)
    expect(output[0].article_id).toEqual(1)
    expect(output[1].article_id).toEqual(2)
    expect(output[2].article_id).toEqual(2)
});
  test('doesnt mutate original array',()=>{
    formatComments(comments,articleData)
      expect(comments).toEqual([{
        body:
          "body 1",
        belongs_to: "title 1",
        created_by: 'writer 1',
        votes: 1,
        created_at: 1511354163389,
      },
      {
        body:
          "body 2",
        belongs_to: "title 2",
        created_by: 'writer 2',
        votes: 2,
        created_at: 1479818163389,
      },
      {
        body:
          "body 3",
        belongs_to: "title 2",
        created_by: 'writer 3',
        votes: 3,
        created_at: 1448282163389,
      }])
    })
})