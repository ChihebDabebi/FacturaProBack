const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ _id: user.id, role: user.role });
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken').json({ message: 'Logged out' });
};
