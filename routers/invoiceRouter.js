const express = require('express');
const router = express.Router();
const { Invoice } = require('../models/invoice');

const invoiceController = require('../controllers/invoiceController');
const {auth} = require('../middlewares/auth');
router.post('/', invoiceController.createInvoice);
router.get('/',auth, invoiceController.getAllInvoices);
router.get('/:id',auth, invoiceController.getInvoiceById);
router.get('/client/:clientId',auth, invoiceController.getInvoicesByClientId);
router.put('/:id',auth, invoiceController.updateInvoice);
router.delete('/:id',auth, invoiceController.deleteInvoice);
router.put('/sign/:id', async (req, res) => {
  try {
    const { signature, signedBy, signedAt } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).send('Invoice not found');

    invoice.signature = {
      image: signature,
      signedBy,
      signedAt,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };


    await invoice.save();
    res.status(200).json({ message: 'Invoice signed', invoice });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
module.exports = router;
