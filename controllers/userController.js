const { User, Client } = require('../models/user');

exports.createUser = async (req, res) => {
  try {
    const { role, ...data } = req.body;

    let newUser;
    if (role === 'client') {
      newUser = new Client(data); 
    } else {
      newUser = new User(data); 
    }

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
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
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur.' });
  }
};
