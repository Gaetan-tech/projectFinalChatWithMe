
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const User = require('./models/User');

// Initialisation
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre io accessible dans les routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/messages', require('./routes/messages'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Chat avec système de flags' });
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  // Authentification de l'utilisateur via Socket.IO
  socket.on('authenticate', async (data) => {
    try {
      const { userId } = data;
      
      // Mettre à jour l'utilisateur avec le socketId
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
        lastSeen: new Date()
      });

      socket.userId = userId;
      socket.join(`user_${userId}`);
      
      // Notifier tous les autres utilisateurs
      socket.broadcast.emit('user_online', { userId });
      
      console.log(`Utilisateur ${userId} authentifié`);
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
    }
  });

  // Rejoindre une room de sujet
  socket.on('join_subject', (data) => {
    const { subjectId } = data;
    socket.join(`subject_${subjectId}`);
    console.log(`Socket ${socket.id} a rejoint le sujet ${subjectId}`);
  });

  // Quitter une room de sujet
  socket.on('leave_subject', (data) => {
    const { subjectId } = data;
    socket.leave(`subject_${subjectId}`);
    console.log(`Socket ${socket.id} a quitté le sujet ${subjectId}`);
  });

  // L'utilisateur est en train d'écrire
  socket.on('typing', (data) => {
    const { subjectId, username } = data;
    socket.to(`subject_${subjectId}`).emit('user_typing', { username });
  });

  // L'utilisateur a arrêté d'écrire
  socket.on('stop_typing', (data) => {
    const { subjectId, username } = data;
    socket.to(`subject_${subjectId}`).emit('user_stop_typing', { username });
  });

  // Déconnexion
  socket.on('disconnect', async () => {
    console.log('Utilisateur déconnecté:', socket.id);
    
    try {
      if (socket.userId) {
        // Mettre à jour le statut de l'utilisateur
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          socketId: null,
          lastSeen: new Date()
        });
        
        // Notifier tous les autres utilisateurs
        socket.broadcast.emit('user_offline', { userId: socket.userId });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue', error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});