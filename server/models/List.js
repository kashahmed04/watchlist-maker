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
  status: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
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

ListSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  status: doc.status,
  rating: doc.rating,
});

// Create the model based on the schema.
const ListModel = mongoose.model('Item', ListSchema);
module.exports = ListModel;
