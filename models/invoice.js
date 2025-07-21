const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
  },
  prixUnitaire: {
    type: Number,
    required: true,
  },
  tva: {
    type: Number,
    default: 0,
  }
});

const paiementSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  moyen: {
    type: String,
    enum: ['virement', 'carte', 'espèces', 'chèque'],
    default: 'virement',
  },
});

const invoice = new mongoose.Schema({
  numero: {
    type: String,
    unique: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  dateEmission: {
    type: Date,
    required: true,
  },
  dateEcheance: {
    type: Date,
    required: true,
  },
  produits: [produitSchema],
  statut: {
    type: String,
    enum: ['brouillon', 'envoyée', 'payée', 'en retard'],
    default: 'brouillon',
  },
  totalHT: {
    type: Number,
    required: true,
    default: 0,

  },
  tva: {
    type: Number,
    required: true,
    default: 0,
  },
  totalTTC: {
    type: Number,
    required: true,
    default: 0,
  },
  paiements: [paiementSchema],

  dateCreation: {
    type: Date,
    default: Date.now,
  },

});

invoice.index({ clientId: 1, statut: 1, dateEcheance: 1 });


const Invoice = mongoose.model("invoices", invoice);

module.exports = { Invoice };
