const models = require('../models');

//write unit tests for if we tried to make a list item with these settings will we be able
//to create the list 
//make request and response mocks for express and search library to use them
//make a fake request and response to mock it like we are using express
//need to have enough of the request object for us to test our application
//do end to end tests with github actions and mimic how a user would use the application
//instead of github actions use circle.CI**

// Get List.js from the models folder.
const { List } = models;

// Renders the main page.
const makerPage = (req, res) => res.render('app');

// Renders the error page.
const renderErrorPage = (req, res) => res.render('error');

// Get the watchlist based on the users _id and return it. If there is an error
// we return the error instead.
const getList = async (req, res) => {
  try {
    // still gets the rating without putting it here why****
    const query = { owner: req.session.account._id };
    const docs = await List.find(query).select('title status rating').sort({'createDate': 'descending'}).lean().exec();

    return res.json({ items: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving watchlist!' });
  }
};

// is it ok to check if status and rating exist here and in maker.JSX in ListForm even though they have 
// default values****

// Make sure all the fields are filled in, create the new item, save it into the database,
// and return a success status. If there is an error we return the error.
// We also check if someone goes to make a list entry, and if they are subscribed
// then allow them to add any number of items otherwise if they are not subscribed
// then allow them to only add 5 items.
const makeList = async (req, res) => {
  if (!req.body.title || !req.body.status || !req.body.rating) {
    return res.status(400).json({ error: 'Title, status, and rating are required!' });
  }

  // 400 error if not enough space
  const current = await List.find({ owner: req.session.account._id }).exec();

  if (!req.session.account.isSubscribed && current.length >= 5) {
    return res.status(400).json({ error: 'Subscribe to add more items!' });
  }

  const listData = {
    title: req.body.title,
    status: req.body.status,
    rating: req.body.rating,
    owner: req.session.account._id,
  };

  try {
    const newListItem = new List(listData);
    await newListItem.save();
    return res.status(201).json({ title: newListItem.title, status: newListItem.status, rating: newListItem.rating });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Item already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making the Item!' });
  }
};

// Find the specific item and delete it based on the _id.
// If the item does not exist show the error status and message
// and if there was an error during that process,
// return the error.
const deleteListItem = async (req, res) => {
  try {
    const userId = req.session.account._id;
    const { id } = req.params;

    const item = await List.findOne({ _id: id, owner: userId });

    if (!item) {
      return res.status(404).json({ message: 'Item does not exist!' });
    }

    await List.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting the item!' });
  }
};

// Export the functions.
module.exports = {
  makerPage,
  renderErrorPage,
  getList,
  makeList,
  deleteListItem,
};
