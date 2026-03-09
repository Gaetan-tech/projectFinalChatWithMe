const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Envoyer un message
router.post('/', auth, messageController.sendMessage);

// Obtenir les messages d'un sujet
router.get('/subject/:subjectId', auth, messageController.getMessages);

// Marquer comme lu
router.put('/subject/:subjectId/read', auth, messageController.markAsRead);

module.exports = router;