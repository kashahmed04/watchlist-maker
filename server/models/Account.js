const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  isSubscribed: {
    type: Boolean,
    default: false, // Default to false for new accounts
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// we do not store password or createdDate in the toAPI right**
// can we leave this here even though we do not use it****
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
  isSubscribed: doc.isSubscribed,
});

AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }
    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

// Toggle subscription status
AccountSchema.methods.toggleSubscription = async function () {
  this.isSubscribed = !this.isSubscribed;
  await this.save();
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
