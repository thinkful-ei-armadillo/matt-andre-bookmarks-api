/* global supertest */
const knexFn = require('knex');
const app = require('../src/app');

const db = knexFn({
  client: 'pg',
  connection: process.env.DB_URL,
});

describe('Testing bookmarks endpoints...', () => {
  it('GET /bookmarks returns something', () => {
    return supertest(app)
      .get('/bookmarks')
      .expect(200);
  });
});