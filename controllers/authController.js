const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/authUtils');

const JWT_SECRET = process.env.JWT_SECRET;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    try {
        const { nom, prenom, email, password, role, entreprise } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (role == "client") {
            const client = new User({ nom, prenom, email, password: hashedPassword, role, entreprise });
            await client.save();

            res.status(201).json({ message: "Client registered successfully." });
        }

        const user = new User({ nom, prenom, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Mot de passe incorrect' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
            accessToken,
            refreshToken,
            user: { id: user._id, nom: user.nom, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
