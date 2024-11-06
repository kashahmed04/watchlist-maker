// can dynamic react components be adding,
// deleting, copying to clipboard, profit model, and storing files (check with functions)
// go over code to see if they count for requirements**
// subscribe and change password not working**
// why am I getting an uncaught type error for when I login but the login still works**
// does my main page look different from domo maker**
// change password is cutting off why**

// have uploading photo for the list be optional otherwise show a default image
// for when we add an item to the list instead of changing profile photo or both**
// does mongoDB make each collection plural by default (list and account in models.js)**
// I had a domo and list colection and deleted them in the database so are they deleted in general
// or how do we know when they are deleted from all accounts in general**
// get password change functionality working as well as subscription functionality working**
// do we have to comment this file or no**
// delete functionality not working anymore**
// when we are in the database and we delete an account but are still in it we are
// allowed to add items to the list and it saves in the database is that ok
// but when we log out we cannot access the account but the items are still in the database**
// is the way list items saves ok (all data is combined in the database
// but each account displays it separately based on the account)**
// do we have to have functionality if the password change is the same as current password**
// make nav bar responive (is the responsiveness ok)**
// make sure there is no domo in final submission**
// should I make watchlist vertical or horizontal (looks similar to domo maker)**
// can I just change background color instead of making the bottom area a 
// flexbox since the above 2 areas are a flexbox already and the color will not get affected
// for those to areas**
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

  app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
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
