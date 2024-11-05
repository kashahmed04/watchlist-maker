const mongoose = require('mongoose');

const _ = require('underscore');

const setName = (title) => _.escape(title).trim();

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  // do we still need this in the schema even though the dropdown already
  // is a string (have it setup in maker.JSX and list.js in controllers)**
  status: {
    type: String,
    required: true,
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

ListSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  status: doc.status,
});

const ListModel = mongoose.model('Item', ListSchema);
module.exports = ListModel;
