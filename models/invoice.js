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
  },
  totalLigne: {
    type: Number,
    required: true,
  },
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

const invoiceSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
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
  },
  tva: {
    type: Number,
    required: true,
  },
  totalTTC: {
    type: Number,
    required: true,
  },
  paiements: [paiementSchema],
  note: {
    type: String,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  pdfUrl: {
    type: String,
  },
});

const Invoice = mongoose.model("invoices", invoice);

module.exports = {Invoice};
