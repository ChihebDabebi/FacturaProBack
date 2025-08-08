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
    const totalInvoices = invoices.filter(inv=>inv.statut!== 'brouillon').length;
    
    const totalRevenue = invoices.reduce((acc, inv) => {
      if(inv.statut === 'payée') {
        return acc + (inv.totalTTC || 0);
      }
      return acc;
      }, 0);
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
      if (inv.statut !== 'brouillon')
      {const month = new Date(inv.dateEmission).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyTotals[month]) monthlyTotals[month] = 0;
      monthlyTotals[month] += inv.totalTTC || 0;}
    });

    const labels = Object.keys(monthlyTotals);
    const data = Object.values(monthlyTotals);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const invoices = await Invoice.find({ clientId });

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.statut === 'payée');
    const overdueInvoices = invoices.filter(
      inv => new Date(inv.dateEcheance) < new Date() && inv.statut !== 'payée'
    );
    const unpaidInvoices = invoices.filter(inv => inv.statut !== 'payée');
    const outstandingBalance = unpaidInvoices.reduce((sum, inv) => sum + (inv.totalTTC || 0), 0);

    const futureDueDates = invoices
      .filter(inv => new Date(inv.dateEcheance) >= new Date() && inv.statut !== 'payée')
      .map(inv => new Date(inv.dateEcheance));
    const nextDueDate = futureDueDates.length > 0 ? new Date(Math.min(...futureDueDates)) : null;

    res.json({
      totalInvoices,
      paidInvoicesCount: paidInvoices.length,
      paidPercentage: totalInvoices > 0 ? ((paidInvoices.length / totalInvoices) * 100).toFixed(2) : '0.00',
      overdueCount: overdueInvoices.length,
      outstandingBalance,
      nextDueDate
    });
  } catch (err) {
    console.error('Erreur dans les stats client :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
});

module.exports = router;