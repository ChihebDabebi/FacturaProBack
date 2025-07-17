const mongoose = require('mongoose');

const client = new mongoose.schema ({
nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
  },
  entreprise: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
  },
  adresse: {
    type: String,
  },
  
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});
const Client = mongoose.model('clients',client);
module.exports = {Client};