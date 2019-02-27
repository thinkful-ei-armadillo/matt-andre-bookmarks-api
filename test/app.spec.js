/* global supertest */
const knexFn = require('knex');
const app = require('../src/app');
const { bookmarks } = require('./fixtures');

const db = knexFn({
  client: 'pg',
  connection: process.env.TEST_DB_URL,
});

const tableName = 'bookmarks';

describe('Testing bookmarks endpoints...', () => {
  before(() => db(tableName).truncate());
  beforeEach(() => db.insert(bookmarks).into(tableName));
  afterEach(() => db(tableName).truncate());
  after(() => db.destroy());

  it('GET /bookmarks returns something', () => {
    return supertest(app)
      .get('/bookmarks')
      .expect(200);
  });
});