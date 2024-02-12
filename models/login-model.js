const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    userID: mongoose.Schema.Types.ObjectId,
    name: String,
    password: String,
    creationDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
    deletionDate: { type: Date, default: null },
    isAdmin: { type: Boolean, default: false },
  });

const users = mongoose.model('users', userSchema);

module.exports = users;