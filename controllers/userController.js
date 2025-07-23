const { User } = require('../models/user');
const { Invoice } = require('../models/invoice');

const authController = require('./authController');

exports.createUser = async (req, res) => {
  try {
    // Ensure that role is set to 'client'
    req.body.role = 'client';

    // Delegate to authController's register method
    await authController.register(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const {role} = req.query;
  
    const users = await User.find({role}).select('-password'); 
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur.' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’utilisateur.' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    await Invoice.deleteMany({ clientId: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur.' });
  }
};
