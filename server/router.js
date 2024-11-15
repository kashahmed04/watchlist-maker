const controllers = require('./controllers');
const mid = require('./middleware');

// Configures routes for different endpoints with middleware for security,
// authentication, and error handling.
const router = (app) => {
  app.get('/getList', mid.requiresLogin, controllers.List.getList);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.List.makerPage);

  app.post('/maker', mid.requiresLogin, controllers.List.makeList);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.post('/subscribe', mid.requiresLogin, controllers.Account.subscribe);

  // The id is for determining which item to delete from the database.**
  app.delete('/deleteItem/:id', mid.requiresLogin, controllers.List.deleteListItem);

  app.get('/getUserInfo', mid.requiresLogin, controllers.Account.getUserInfo);
  app.get('/getSubscribed', mid.requiresLogin, controllers.Account.getSubscribed);

  app.get('/*', mid.requiresSecure, controllers.List.renderErrorPage);
};

module.exports = router;
