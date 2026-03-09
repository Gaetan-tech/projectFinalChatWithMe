const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Obtenir le profil
router.get('/profile', auth, userController.getProfile);

// Changer le statut du flag
router.put('/flag-status', auth, userController.changeFlagStatus);

// Obtenir les utilisateurs avec flag vert
router.get('/green-flags', auth, userController.getGreenFlagUsers);

// Obtenir les utilisateurs avec flag rouge
router.get('/red-flags', auth, userController.getRedFlagUsers);

// Obtenir les utilisateurs en ligne
router.get('/online', auth, userController.getOnlineUsers);

module.exports = router;