const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const {auth} = require('../middlewares/auth');
router.post('/', invoiceController.createInvoice);
router.get('/',auth, invoiceController.getAllInvoices);
router.get('/:id',auth, invoiceController.getInvoiceById);
router.get('/client/:clientId',auth, invoiceController.getInvoicesByClientId);
router.put('/:id',auth, invoiceController.updateInvoice);
router.delete('/:id',auth, invoiceController.deleteInvoice);

module.exports = router;
