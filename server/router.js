const controllers = require('./controllers');
const mid = require('./middleware');

// add change password and subscribe pathname with middleware**
// why are my pathnames not working**
const router = (app) => {
  app.get('/getList', mid.requiresLogin, controllers.List.getList);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.List.makerPage);

  app.post('/maker', mid.requiresLogin, controllers.List.makeList);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  //is this ok for changing password and put it in account.js for backend then
  //in maker.JSX have the functionality for the client side**
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.delete('/deleteItem/:id', mid.requiresLogin, controllers.List.deleteListItem);
};

module.exports = router;
