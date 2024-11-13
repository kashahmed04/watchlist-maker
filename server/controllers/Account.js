const models = require('../models');

// is it ok to be concise when commenting functions like this****

// Get Account.js from the models folder.
const { Account } = models;

// Renders the login page.
const loginPage = (req, res) => res.render('login');

// Destroys the session and redirects to the login page.
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Authenticates the user to login and redirects to /maker if successful, or returns an error.
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

// Creates a new account, saves it, and redirects to /maker if successful, or returns an error.
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

// Changes the user's password if the new password is not the same as the old password,
// and the passwords typed in match, then redirects to /logout.
const changePassword = async (req, res) => {
  const pass = `${req.body.pass}`;

  const pass2 = `${req.body.pass2}`;

  const oldPassword = `${req.body.oldPass}`;

  if (!pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  Account.authenticate(req.session.account.username, oldPassword, (err, account)  => {
    if (err || !account) {
      return res.status(401).json({ error: 'New password cant be current password!' });
    }

    Account.generateHash(pass).then(async (password) => {
      await Account.findByIdAndUpdate(req.session.account._id, { password });
  
      console.log('password change successful');
    
      return res.json({ redirect: '/logout' });
    });
   

  });
  
};

// Toggles the user's subscription status and saves it, then returns the new status.
const subscribe = async (req, res) => {
  try {
    const user = await Account.findById(req.session.account._id);

    user.isSubscribed = !user.isSubscribed;

    await user.save();

    req.session.account = Account.toAPI(user);

    return res.status(200).json({ message: 'Subscription changed successfully!', subscribed: user.isSubscribed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to change subscription status!' });
  }
};

// Returns the subscription status of the user.
const getSubscribed = async (req,res) => {
  try{
    const acc = await Account.findById(req.session.account._id);
    if(!acc) {
      return res.json({subscribed: false});
    }

    return res.json({subscribed: acc.isSubscribed});
  } catch(err) {
    console.log(err);
    return res.json({subscribed: false});
  }
}

// is this ok to get user info. to show the username on the top of the maker form****
// Returns the user's username if logged in.
const getUserInfo = (req, res) => {
  if (req.session.account) {
    const { username } = req.session.account;
    res.json({ username });
  } else {
    res.status(401).json({ error: 'User not logged in!' });
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
  getSubscribed,
  getUserInfo,
};
