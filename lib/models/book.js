const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  author: RequiredString,
  year: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Book', schema);