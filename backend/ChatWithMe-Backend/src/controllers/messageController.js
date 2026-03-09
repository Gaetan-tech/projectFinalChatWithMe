const Message = require('../models/Message');
const Subject = require('../models/Subject');

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { subjectId, content } = req.body;

    // Vérifier que le sujet existe
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Sujet non trouvé' });
    }

    // Vérifier que l'utilisateur est participant
    if (!subject.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Vous n\'êtes pas participant de ce sujet' });
    }

    // Créer le message
    const message = new Message({
      subject: subjectId,
      sender: req.userId,
      content
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email');

    // Émettre le message via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').to(`subject_${subjectId}`).emit('new_message', populatedMessage);
    }

    res.status(201).json({ 
      message: 'Message envoyé',
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi', error: error.message });
  }
};

// Obtenir les messages d'un sujet
exports.getMessages = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Vérifier que le sujet existe
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Sujet non trouvé' });
    }

    // Vérifier que l'utilisateur est participant
    if (!subject.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Vous n\'êtes pas participant de ce sujet' });
    }

    const messages = await Message.find({ subject: subjectId })
      .populate('sender', 'username email')
      .sort('createdAt')
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({ 
      messages,
      total: await Message.countDocuments({ subject: subjectId })
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// Marquer les messages comme lus
exports.markAsRead = async (req, res) => {
  try {
    const { subjectId } = req.params;

    await Message.updateMany(
      { 
        subject: subjectId,
        sender: { $ne: req.userId },
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marqués comme lus' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};