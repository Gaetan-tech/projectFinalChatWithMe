const Subject = require('../models/Subject');
const User = require('../models/User');

// Créer un sujet (et activer le flag rouge automatiquement)
exports.createSubject = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Créer le sujet
    const subject = new Subject({
      title,
      description,
      creator: req.userId,
      participants: [req.userId]
    });

    await subject.save();

    // Activer automatiquement le flag rouge de l'utilisateur
    const user = await User.findById(req.userId);
    user.flagStatus = 'red';
    await user.save();

    // Émettre l'événement
    if (req.app.get('io')) {
      req.app.get('io').emit('new_subject_created', {
        subject: await subject.populate('creator', 'username email flagStatus isOnline'),
        user: user.toJSON()
      });
    }

    res.status(201).json({ 
      message: 'Sujet créé avec succès',
      subject: await subject.populate('creator', 'username email flagStatus isOnline')
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Obtenir tous les sujets actifs
exports.getActiveSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      isActive: true,
      status: { $in: ['waiting', 'active'] }
    })
    .populate('creator', 'username email flagStatus isOnline')
    .populate('participants', 'username email flagStatus isOnline')
    .sort('-createdAt');

    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// Obtenir les sujets de l'utilisateur
exports.getMySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      $or: [
        { creator: req.userId },
        { participants: req.userId }
      ]
    })
    .populate('creator', 'username email flagStatus isOnline')
    .populate('participants', 'username email flagStatus isOnline')
    .sort('-createdAt');

    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// Rejoindre un sujet (utilisateur avec flag vert)
exports.joinSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: 'Sujet non trouvé' });
    }

    // Vérifier que l'utilisateur a le flag vert
    const user = await User.findById(req.userId);
    if (user.flagStatus !== 'green') {
      return res.status(403).json({ 
        message: 'Vous devez activer votre flag vert pour rejoindre un sujet' 
      });
    }

    // Vérifier que le créateur a le flag rouge
    const creator = await User.findById(subject.creator);
    if (creator.flagStatus !== 'red' || !creator.isOnline) {
      return res.status(403).json({ 
        message: 'Le créateur n\'est plus disponible pour ce sujet' 
      });
    }

    // Ajouter l'utilisateur aux participants
    if (!subject.participants.includes(req.userId)) {
      subject.participants.push(req.userId);
      subject.status = 'active';
      await subject.save();
    }

    // Émettre l'événement
    if (req.app.get('io')) {
      req.app.get('io').emit('user_joined_subject', {
        subjectId: subject._id,
        user: user.toJSON()
      });
    }

    res.json({ 
      message: 'Vous avez rejoint le sujet',
      subject: await subject.populate(['creator', 'participants'])
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la jonction', error: error.message });
  }
};

// Fermer un sujet
exports.closeSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: 'Sujet non trouvé' });
    }

    // Vérifier que l'utilisateur est le créateur
    if (subject.creator.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Seul le créateur peut fermer le sujet' });
    }

    subject.isActive = false;
    subject.status = 'closed';
    await subject.save();

    // Réinitialiser le flag du créateur
    const user = await User.findById(req.userId);
    user.flagStatus = 'none';
    await user.save();

    // Émettre l'événement
    if (req.app.get('io')) {
      req.app.get('io').emit('subject_closed', {
        subjectId: subject._id
      });
    }

    res.json({ message: 'Sujet fermé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la fermeture', error: error.message });
  }
};

// Supprimer un sujet (créateur seulement)
exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: 'Sujet non trouvé' });
    }

    // Vérifier que l'utilisateur est le créateur
    if (subject.creator.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Seul le créateur peut supprimer le sujet' });
    }

    // Supprimer le sujet
    await Subject.findByIdAndDelete(subjectId);

    // Réinitialiser le flag du créateur
    try {
      const user = await User.findById(req.userId);
      if (user) {
        user.flagStatus = 'none';
        await user.save();
      }
    } catch (err) {
      // Ne pas bloquer la suppression si la mise à jour du user échoue
      console.error('Erreur lors de la réinitialisation du flag du créateur:', err);
    }

    // Émettre l'événement de suppression
    if (req.app.get('io')) {
      req.app.get('io').emit('subject_deleted', { subjectId });
    }

    res.json({ message: 'Sujet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Obtenir les sujets d'un utilisateur donné (via paramètre userId)
exports.getSubjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const subjects = await Subject.find({
      $or: [
        { creator: userId },
        { participants: userId }
      ]
    })
      .populate('creator', 'username email flagStatus isOnline')
      .populate('participants', 'username email flagStatus isOnline')
      .sort('-createdAt');

    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};