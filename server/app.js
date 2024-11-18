// can dynamic react components
// radio buttons, adding items, subscribe, displaying items on list, and app****
// for external API's on rubric does e2e tests count for this
// go over playwright.config/playwright files for local and heroku
// to make sure they are ok****
// is code ok for DRY requirement for styles as well****
// go over rubric and are comments ok for requirements****
// what is pages/views being dynamic mean on rubric****
// do npm test****
// are we allowed to have styles.css from domo maker and the handlebars files
// as well as login and signup funcitonality (accounts.js from controllers and models
// as well as login.JSX)****
// are comments ok and do we have to comment handlebars files or CSS files****
// how to test if the e2e tests work locally and server side****
// do we need heroku key for e2e tests on heroku or is connection we make in here ok****
// are e2e tests ok for requirement****
// errors are ok in the console if something
// cannot be done right (delete the console.log() statements)****
// for Account passwords must be stored using a password-safe form of encryption
// (such as bcrypt) is that the hashing function we
// made for passwords (for changing and creating password only)****
// is leaving styles page as styles.CSS from domo maker ok****
// can we submit checkpoint and final together****
// why does my data not show up in the database after I added it
// do I have to wait for it to be added (for items but accounts updates
// automatically)****
// we are allowed to have errors in the terminal and console if something
// does not work (we throw the error ourselves when something does not work)****
// is the delete button ok being an id****
// check if heroku keys are ok on heroku and notepad****

// we just need the router.js endpoints for documentation right****
// check documenation****
// GET requests handles HEAD requests too so we can
// just say GET, HEAD for documentation for GET requests
// right****
// do we need requires secure for every path or just login,signup,/, and /* (check routes)****
// the last function does not count as middleware
// so we do not add it to our documentaiton endpoints right
// for router****
// does mongoDB make each collection plural by default (list (item) and account in models.js)****
// I had a domo and list collection and deleted them in the database so are they deleted in general
// or how do we know when they are deleted from all accounts in general****
// do we have to comment this file or no****

// make sure there is no domo in final submission (check with milestone)****
// make sure heroku connections are ok when we create the application****
// make sure end to end tests are connected to heroku****
// get heroku connected to application with correct keys****

// do end to end tests and fix radial buttons****

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
