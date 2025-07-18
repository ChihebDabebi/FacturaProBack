const { Invoice } = require('../models/invoice');
const { Client } = require('../models/client');

exports.createInvoice = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString();
    const day = now.getDay().toString();
    const min = now.getMinutes().toString();
    const mills = now.getMilliseconds().toString();
    const numero = `FAC-${year}${month}${day}-${min}${mills}`;
    const newInvoice = new Invoice(req.body);
    newInvoice.produits.forEach(e => {
      newInvoice.totalHT += e.prixUnitaire * e.quantite;
      if (e.tva != 0) {
        newInvoice.tva += (e.prixUnitaire * e.quantite) * (e.tva / 100);
      }
    });
    newInvoice.totalTTC = newInvoice.totalHT + newInvoice.tva;
    newInvoice.numero = numero;
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('clientId');
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('clientId');
    if (!invoice) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoicesByClientId = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const invoices = await Invoice.find({ clientId });
    
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Aucune facture trouvée pour ce client' });
    }

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvoice) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
