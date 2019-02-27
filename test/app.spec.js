/* global supertest */
const knexFn = require('knex');
const app = require('../src/app');
const bookmarks = require('./fixtures');



const tableName = 'bookmarks';

describe('Testing bookmarks endpoints...', () => {

  let db;

  before(() => {
    db = knexFn({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  })
  before(() => db(tableName).truncate());

  afterEach(() => db(tableName).truncate());
  after(() => db.destroy());



  describe('testing with data', () => {
    // it('GET /bookmarks returns something', () => {
    //   return supertest(app)
    //     .get('/bookmarks')
    //     .expect(200);
    // });
    context('testing with data', () => {
      beforeEach(() => db.into(tableName).insert(bookmarks));

      it('DELETE /bookmarks should delete bookmark', () => {
        let id =2;

        db(tableName)
          .select('*')
          .then(results => {
            console.log(results)
            // id = results[0].id;
            console.log(id);
            return supertest(app)
              .delete(`/bookmarks/${id}`)
              .expect(204);
          })
      })

    })
  })


});