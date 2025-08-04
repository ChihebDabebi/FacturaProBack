const express = require('express');
const router = express.Router();
const {Invoice} = require('../models/invoice');
const {User} = require('../models/user');

router.get('/clients', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'client' });
    res.json({ totalClients: count });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 2. Total Invoices + Total Revenue + Paid %
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.totalTTC || 0), 0);
    const paidCount = invoices.filter(inv => inv.statut === 'payée').length;
    const paidPercentage = totalInvoices > 0 ? ((paidCount / totalInvoices) * 100).toFixed(2) : 0;

    res.json({ totalInvoices, totalRevenue, paidPercentage });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 3. Invoices by Month
router.get('/invoices/monthly', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const monthlyTotals = {};

    invoices.forEach(inv => {
      const month = new Date(inv.dateEmission).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyTotals[month]) monthlyTotals[month] = 0;
      monthlyTotals[month] += inv.totalTTC || 0;
    });

    const labels = Object.keys(monthlyTotals);
    const data = Object.values(monthlyTotals);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;