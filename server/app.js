// can dynamic react components be adding,
// deleting, copying to clipboard, profit model, and storing files (check with functions)(and socket)****
// can storing files be used for honors requirement instead of socket (use socket)**
// errors are ok in the console if something cannot be done right (delete the console.log() statements)**
// should image go after or before the delete button (take away images)**
// how to handle adding an image and having a default image if nothing is put in for watchlist instead
// of profiles**
// is logic ok for only handling titlename and status why does it say 
// all fields required when I want to make adding an image optional otherwise 
// put the popcorn image if nothing is selected for an image (would the logic be in 
// handleList for the image for each item in the list)**
// add image button also adds items to the list why**
// for Account passwords must be stored using a password-safe form of encryption
// (such as bcrypt) is that the hashing function we made for passwords (for changing and creating password only)**

// even though we have url encoded on the bottom if we do not use it the endpoint is JSON right****
// is handlebars file ok for documentation****
// we just need the router points for documentation right****
// check documenation****
// GET requests handles HEAD requests too so we can just say GET, HEAD for documentation for GET requests
// right****
// do we need requires secure for every path or just login and signup****
// the last function does not count as middleware so we do not add it to our documentaiton right
// for router****
// is a react component basically an element we put into a comonpent in the JSX files and use or does it have to be in a 
// separate component to count for the project****

// have uploading photo for the list be optional otherwise show a default image
// for when we add an item to the list instead of changing profile photo or both**
// does mongoDB make each collection plural by default (list (item) and account in models.js)****
// I had a domo and list colection and deleted them in the database so are they deleted in general
// or how do we know when they are deleted from all accounts in general****
// do we have to comment this file or no**
// make sure there is no domo in final submission**

// app.js styling (get each list item information to show on the left side
// and make room for image upload or default image on the right in flexbox), 
// 404 page (only)**, separate CSS file for 404 page (HTML page or handlebars)**,
// uploading files for images functionality (how to make sure they only upload an image
// not another file instead)**
// style 404 page and make sure it works with routes in router.js and list.js
// in controllers**
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
