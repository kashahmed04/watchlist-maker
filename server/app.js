// can dynamic react components be adding,
// deleting, copying to clipboard, profit model, and ratings (check if they are components that would count for project)****
// can unit testing be used for honors requirement and what tests could we do (how much)****
// errors are ok in the console if something cannot be done right (delete the console.log() statements)****
// for Account passwords must be stored using a password-safe form of encryption
// (such as bcrypt) is that the hashing function we made for passwords (for changing and creating password only)****

// even though we have url encoded on the bottom if we do not use it the endpoint is JSON 
// for documentation right****
// we just need the router endpoints for documentation right****
// check documenation****
// GET requests handles HEAD requests too so we can just say GET, HEAD for documentation for GET requests
// right****
// do we need requires secure for every path or just login,signup,/, and /* (check routes)****
// the last function does not count as middleware so we do not add it to our documentaiton endpoints right
// for router****
// is a react component basically an element we put into a comonpent in the JSX files and use or does it have to be in a 
// separate component to count for the project (5 separate components)****
// does mongoDB make each collection plural by default (list (item) and account in models.js)****
// I had a domo and list collection and deleted them in the database so are they deleted in general
// or how do we know when they are deleted from all accounts in general****
// do we have to comment this file or no****

// make sure there is no domo in final submission****

require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');

const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
// how would I change this within heroku**
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/WatchlistMaker';

mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
  const app = express();

  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

  app.use(session({
    key: 'sessionid',

    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'Watchlist',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(favicon(`${__dirname}/../hosted/img/popcorn.png`));
  app.use(compression());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  router(app);

  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port ${port}`);
  });
});
