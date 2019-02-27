require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const knexFn = require('knex');
const { NODE_ENV } = require('./config');
const { bookmarks } = require('./store');
const BookmarksService = require('./bookmarksService');

const app = express();
const router = express.Router();

const db = knexFn({
  client: 'pg',
  connection: process.env.DB_URL,
});

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(router);

app.use(function handleToken(req, res, next) {
  let authToken = req.get('Authorization').split(' ')[1];
  let apiKey = process.env.API_KEY;

  if(authToken !== apiKey) {
    return res.status(401).send('Unauthorized');
  }

  next();
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});


router.route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAll(db)
      .then(result => {
        return res.json(result);
      })
      .catch(next);
  })
  .post(express.json(), (req, res) => {
    const { title, url, description, rating } = req.body;

    const bookmark = {
      title,
      url,
      description,
      rating
    };

    BookmarksService.insert(db, bookmark)
      .then(result => {
        res.status(204).location(`http://localhost:8000/bookmarks/${result.id}`).end();
      });

  });

router.route('/bookmarks/:id')
  .get((req, res) => {
    BookmarksService.getById(db, req.params.id)
      .then(result => {
        if(result[0]) {
          res.json(result[0]);
        } else {
          res.status(404).send('Bookmark not found');
        }
      });
  })
  .delete((req, res) => {
    let index = bookmarks.findIndex(b => b.id === req.params.id);

    if(index !== -1) {
      bookmarks.splice(index, 1);

      res.status(204).end();
    } else {
      res.status(404).send('Bookmark not found');
    }
  });

module.exports = app;