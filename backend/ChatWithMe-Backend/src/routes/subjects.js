const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const auth = require('../middleware/auth');

// Créer un sujet
router.post('/', auth, subjectController.createSubject);

// Obtenir tous les sujets actifs
router.get('/active', auth, subjectController.getActiveSubjects);

// Obtenir mes sujets
router.get('/my-subjects', auth, subjectController.getMySubjects);

// Obtenir les sujets d'un utilisateur (par son id) - utile pour certains clients
router.get('/user/:userId', auth, subjectController.getSubjectsByUser);

// Rejoindre un sujet
router.post('/:subjectId/join', auth, subjectController.joinSubject);

// Fermer un sujet
router.put('/:subjectId/close', auth, subjectController.closeSubject);

// Supprimer un sujet (créateur seulement)
router.delete('/:subjectId', auth, subjectController.deleteSubject);

module.exports = router;