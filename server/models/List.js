const mongoose = require('mongoose');

const _ = require('underscore');

const setName = (title) => _.escape(title).trim();

// Schema of what each list item will contain.
const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  // do we still need this in the schema even though the dropdown already
  // is a string (have it setup in maker.JSX and list.js in controllers)****
  status: {
    type: String,
    required: true,
  },
  rating: {
    type: String, 
    required: true,
    //is this ok even though we set up the values already in maker.JSX and a default value
    //but we restrict them to these values here only****
    enum: ['Excellent', 'Good', 'OK', 'Bad'],
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

// do we need this here or can we delete it since we do not use it**
// we do not store owner or createdDate right**
// can we keep this here if we want even if we do not use it**
ListSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  status: doc.status,
  rating: doc.rating,
});

// Create the model based on the schema.
const ListModel = mongoose.model('Item', ListSchema);
module.exports = ListModel;
