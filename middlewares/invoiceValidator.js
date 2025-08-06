// validators/invoiceValidator.js
const yup = require('yup');

const produitSchema = yup.object().shape({
  description: yup.string().required('Description requise'),
  quantite: yup.number().required('Quantité requise').min(1, 'Quantité minimum 1'),
  prixUnitaire: yup.number().required('Prix unitaire requis').min(0),
  tva: yup.number().min(0).default(0),
});

const paiementSchema = yup.object().shape({
  date: yup.date().required('Date de paiement requise'),
  montant: yup.number().required('Montant requis').min(0),
  moyen: yup.string().oneOf(['virement', 'carte', 'espèces', 'chèque']).default('virement'),
});

const invoiceSchema = yup.object().shape({
  numero: yup.string().required('Numéro de facture requis'),
  clientId: yup.string().required('ID client requis'),
  dateEmission: yup.date().required('Date d\'émission requise'),
  dateEcheance: yup.date().required('Date d\'échéance requise'),
  statut: yup.string().oneOf(['brouillon', 'envoyée', 'payée', 'en retard']),
  produits: yup.array().of(produitSchema).min(1, 'Au moins un produit est requis'),
  totalHT: yup.number().required().min(0),
  tva: yup.number().required().min(0),
  totalTTC: yup.number().required().min(0),
  paiements: yup.array().of(paiementSchema).notRequired().default(()=>[]),
  dateCreation: yup.date().default(() => new Date())
});

module.exports = { invoiceSchema };
