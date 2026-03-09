const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà.' 
      });
    }

    // Créer un nouvel utilisateur
    const user = new User({ username, email, password });
    await user.save();

    // Générer un token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '7d' 
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Mettre à jour le statut en ligne
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Générer un token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '7d' 
    });

    res.json({
      message: 'Connexion réussie',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};

// Déconnexion
exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.isOnline = false;
    user.flagStatus = 'none';
    user.socketId = null;
    user.lastSeen = new Date();
    await user.save();

    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion', error: error.message });
  }
};