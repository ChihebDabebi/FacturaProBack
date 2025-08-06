const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {auth} = require('../middlewares/auth');

router.post('/', auth,userController.createUser);
router.get('/', auth,userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', auth,userController.updateUser);
router.delete('/:id',auth, userController.deleteUser);

module.exports = router;
