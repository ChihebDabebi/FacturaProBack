const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
  },
  adresse: {
    type: String,
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    required: true,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
},
{
  discriminatorKey: 'role',
  collection: 'users',
});
const User = mongoose.model('users', user);

const Client = User.discriminator('client', new Schema({
  entreprise: {
    type: String,
  }
}));
module.exports = { User , Client};