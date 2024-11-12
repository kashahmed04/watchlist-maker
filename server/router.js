const controllers = require('./controllers');
const mid = require('./middleware');

// Add the pathnames for each request as well as the middleware we need to use.
// do we need to put these routes in a specific order or is this ok****
// same for documentation****

// Configures routes for different endpoints with middleware for security,
// authentication, and error handling. (is this ok)****
const router = (app) => {
  app.get('/getList', mid.requiresLogin, controllers.List.getList);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.List.makerPage);

  app.post('/maker', mid.requiresLogin, controllers.List.makeList);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // is this ok for changing password and put it in account.js for backend then
  // in maker.JSX have the functionality for the client side**
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  // is this ok to put on the users account.js instead of in the list.js as well as changePassword
  // but we implement this in maker.JSX client side**
  app.post('/subscribe', mid.requiresLogin, controllers.Account.subscribe);

  // The id is for determining which item to delete from the database.**
  app.delete('/deleteItem/:id', mid.requiresLogin, controllers.List.deleteListItem);

  app.get('/getUserInfo', mid.requiresLogin, controllers.Account.getUserInfo);
  app.get('/getSubscribed', mid.requiresLogin, controllers.Account.getSubscribed);

  //is this ok or should there be any middleware and how do I know which function to route
  //to since a 404 error can happen anywhere****
  //go over 404 routing and how to test (here and in list.js in controllers)**
  app.get('/*', mid.requiresSecure, controllers.List.renderErrorPage);
};

module.exports = router;
