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

  
  after(() => db.destroy());



  describe('testing with data', () => {
    it('GET /bookmarks returns something', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(200);
    });
    context('testing with data', () => {
      beforeEach(() => db.into(tableName).insert(bookmarks));
      afterEach(() => db(tableName).truncate());

      it('DELETE /bookmarks should delete bookmark', () => {
        let id = 2;
        return supertest(app)
          .delete(`/bookmarks/${id}`)
          .expect(204);
      })
      
      it('UPDATE /bookmarks should update bookmark', () => {
        const title = { 
          title: '2MDN',
          url: '4https://developer.mozilla.org',
          description: 'The4 only place to find web documentation',
          rating: 4 }

          return supertest(app)
            .patch('/bookmarks/3')
            .send(title)
            .expect(204);
      })

      it('INSERT /bookmark should insert a new bookmark', ()=>{
        const newBookmark = { 
          title: '2MDN',
          url: '4https://developer.mozilla.org',
          description: 'The4 only place to find web documentation',
          rating: 4 }

          return supertest(app)
            .post('/bookmarks')
            .send(newBookmark)
            .expect(204);
      })

    })
  })


});