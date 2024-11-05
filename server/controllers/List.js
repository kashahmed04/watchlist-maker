const models = require('../models');

const { List } = models;

const makerPage = (req, res) => res.render('app');

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
// as required and we only handle title here**
const makeList = async (req, res) => {
  if (!req.body.title || !req.body.status) {
    return res.status(400).json({ error: 'Title and status are required!' });
  }
  const listData = {
    title: req.body.title,
    status: req.body.status,
    owner: req.session.account._id,
  };

  try {
    const newListItem = new List(listData);
    await newListItem.save();
    return res.status(201).json({ title: newListItem.title, status: newListItem.status });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Item already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making the Item!' });
  }
};

const deleteListItem = async (req, res) => {
  try {
    const userId = req.session.account._id;
    const { id } = req.params;

    const item = await List.findOne({ _id: id, owner: userId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await List.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting the item' });
  }
};

module.exports = {
  makerPage,
  getList,
  makeList,
  deleteListItem,
};
