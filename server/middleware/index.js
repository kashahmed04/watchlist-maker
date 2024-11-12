// Middleware to require a login to do certain actions (routed in router.js).
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};

// Middleware to require a logout to do certain actions (routed in router.js).
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }

  return next();
};

// Makes sure we are using HTTPS when deployed in Heroku.
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

// Bypass the HTTPS requirement when we are using localhost.
const bypassSecure = (req, res, next) => {
  next();
};

// Export the middleware functions to use in router.js.
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Export the middleware based on the enviornment (Heroku or local).
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
