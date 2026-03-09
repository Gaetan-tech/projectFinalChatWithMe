const User = require('../models/User');

// Changer le statut du flag
exports.changeFlagStatus = async (req, res) => {
  try {
    const { flagStatus } = req.body; // 'none', 'green', 'red'
    
    if (!['none', 'green', 'red'].includes(flagStatus)) {
      return res.status(400).json({ message: 'Statut de flag invalide' });
    }

    const user = await User.findById(req.userId);
    user.flagStatus = flagStatus;
    await user.save();

    // Émettre l'événement via Socket.IO (géré dans server.js)
    if (req.app.get('io')) {
      req.app.get('io').emit('flag_status_changed', {
        userId: user._id,
        username: user.username,
        flagStatus: user.flagStatus,
        isOnline: user.isOnline
      });
    }

    res.json({ 
      message: 'Statut du flag mis à jour',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Obtenir tous les utilisateurs avec flag vert (disponibles pour discuter)
exports.getGreenFlagUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      flagStatus: 'green',
      isOnline: true,
      _id: { $ne: req.userId } // Exclure l'utilisateur actuel
    }).select('-password -socketId');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// Obtenir tous les utilisateurs avec flag rouge (ayant un sujet)
exports.getRedFlagUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      flagStatus: 'red',
      isOnline: true,
      _id: { $ne: req.userId }
    }).select('-password -socketId');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -socketId');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// Obtenir tous les utilisateurs en ligne
exports.getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      isOnline: true,
      _id: { $ne: req.userId }
    }).select('-password -socketId');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};