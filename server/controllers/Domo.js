const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age level').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'Name, age, and level are required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};


const deleteDomo = async (req, res) => {
  try {
    const userId = req.session.account._id;
    const { id } = req.params;

    const domo = await Domo.findOne({ _id: id, owner: userId });

    if (!domo) {
      return res.status(404).json({ message: 'Domo not found' });
    }

    await Domo.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Domo deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting Domo' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
