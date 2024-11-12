const models = require('../models');

// is this ok to name this variable List or no since List is a datatype as well**
// Get List.js from the models folder.
const { List } = models;

// Go to the main page.
const makerPage = (req, res) => res.render('app');

//is this ok for 404**
const renderErrorPage = (req, res) => res.render('error');

//is it ok to put this in List.js because this routes in both pages**
const documentationPage = (req, res) => res.render('documentation');

// Get the watchlist based on the users _id and return it. If there is an error
// we return the error instead.
const getList = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await List.find(query).select('title status').lean().exec();

    return res.json({ items: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving watchlist!' });
  }
};

// would we handle title here and dropdown or can dropdown be in the HTML
// as required and we only handle title here****
// Make sure all the fields are filled in, create the new item, save it into the database,
// and return a success status. If there is an error we return the error.
// cheeck in the database and if someone goes to make a list entry then check if they are subscribed
// and if not do they have 5 items, if so then reject them adding the item
const makeList = async (req, res) => {
  //should I still do check for status and rating even though there is a default value****
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

// Find the specific item and delete it based on the id.
// If the item does not exist show the status and message
// and if there was an error during that process,
// return the error.
const deleteListItem = async (req, res) => {
  try {
    const userId = req.session.account._id;
    const { id } = req.params;

    const item = await List.findOne({ _id: id, owner: userId });

    if (!item) {
      //is this ok for 404 since we made it like this in router**
      //I only have one 404 error is that ok**
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
  documentationPage,
  getList,
  makeList,
  deleteListItem,
};
