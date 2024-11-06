const models = require('../models');

// Get Account.js from the models folder.
const { Account } = models;
const loginPage = (req, res) => res.render('login');

// If we want to logout destroy the session and go back to
// the login page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Get the username and password fields we have passed in
// and make sure they are both filled out. After, authenticate
// the account to make sure the account exists and we are able
// to login. If we can login, then we call the toAPI function
// for the account to attach a unique id
// then redirect the user to the /maker page.
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

// Make sure each field is filled in and the passwords
// match, if they do, then hash the password and
// make the new account and save it. After, we attach
// a unique id then redirect the user to the /maker page.
// If there is an error we send it back to the user.
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    // what does it mean we have to do toAPI twice
    // when signing up (will there be two usernames and two id's then)
    // session has a duplicate copy of what is in mongo
    req.session.account = Account.toAPI(newAccount);

    return res.json({ redirect: '/maker' });
  } catch (err) {
    // should we remove console.log() from our code for submission**
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Check if both fields are passed in and they match,
// then we find the users account based on the id and hash
// the new password and save it. After, we redirect the user to
// the login page to login with their new password. If there is an
// error we return the error.
const changePassword = async (req, res) => {
  const pass = `${req.body.pass}`;

  const pass2 = `${req.body.pass2}`;

  if (!pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // find and update the user's password
    //const user = await Account.findOne({ _id: req.session.account._id });
    const password = await Account.generateHash(pass);
    //await user.save();
    await Account.findByIdAndUpdate(req.session.account._id, {password: password});

    console.log("password change successful");

    return res.json({ redirect: '/logout' });
    // is this ok instead of returning the status and the return statement**
    //return logout(req, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while changing password!' });
  }
};

// We find the users account based on the id and change the
// state of their subscription based on the current state
// and save the new state. After, we return the status if it
// was successful, or an error message if there was an error.
const subscribe = async (req, res) => {
  try {
    const user = await Account.findById(req.session.account._id);
    // do we have to put this in the model for an account**
    user.isSubscribed = !user.isSubscribed;

    // console.log(user.isSubscribed);
    // if (!user.isSubscribed && user.watchlistCounter >= 5) {
    //   return res.status(403).json({ error: 'You must subscribe to add more than 5 items to your watchlist.' });
    // }

    // user.watchlistCounter++;
    await user.save();

    return res.status(200).json({ message: 'Subscription changed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to change subscription status.' });
  }
};

// We get the users id and get the specific item, and
// if the user is not subscribed and their watchlist length
// is greater than or equal to 5, we say that they have to subscribe to
// be able to increase the size of items they can add to the list
// otherwise, we add the item to the list and save the data
// and return a success message to the user.
const addItemToWatchlist = async (req, res) => {
  const user = await Account.findById(req.session.account._id);
  //const { item } = req.body;

  console.log(user.isSubscribed);
  if (!user.isSubscribed && user.watchlistCounter >= 5) {
    return res.status(403).json({ error: 'You must subscribe to add more than 5 items to your watchlist.' });
  }

  user.watchlistCounter++;
  await user.save();

  return res.status(200).json({ message: 'Item added to watchlist!' });
};

// is this ok to get user info. to show their username**
const getUserInfo = (req, res) => {
  if (req.session.account) {
    const { username } = req.session.account;
    res.json({ username });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
};

// Export the functions.
module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  subscribe,
  addItemToWatchlist,
  getUserInfo,
};
