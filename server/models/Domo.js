const mongoose = require('mongoose');

const _ = require('underscore');

const setName = (title) => _.escape(title).trim();

// do we not need data for the dropdown here and that only goes
// in the HTML right**
const DomoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  title: doc.title,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
