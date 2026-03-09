# Chat with Me - Backend

Backend de chat en temps réel avec système de flags (vert/rouge) - Node.js + Express + MongoDB + Socket.IO

## 🚀 Installation rapide

```bash
npm install
# Créer .env:
MONGODB_URI=mongodb://localhost:27017/chat-with-me
JWT_SECRET=your_secret_key
PORT=5000

npm run dev  # Développement
npm start    # Production
```

## 📁 Structure

```
src/
├── server.js              # Point d'entrée + Socket.IO
├── config/database.js     # MongoDB
├── controllers/           # Logique métier (auth, messages, users, sujets)
├── middleware/auth.js     # JWT authentication
├── models/                # User, Message, Subject (Mongoose)
└── routes/                # API endpoints
```

## ✨ Features développées

**🔐 Authentification**
- Register, Login, Logout avec JWT + bcryptjs

**💬 Messagerie temps réel**
- Envoyer/récupérer messages
- Marquer comme lu
- Typing indicators
- Socket.IO rooms par sujet

**👥 Sujets/Conversations**
- Créer, lister, rejoindre, fermer, supprimer
- Sujets actifs et personnels

**🚩 Système de flags**
- Flag vert ✅ (utilisateur fiable)
- Flag rouge ⛔ (signalement)
- Lister par flag, voir online

**📡 Socket.IO Events**
- `authenticate` / `join_subject` / `leave_subject`
- `typing` / `stop_typing`
- `user_online` / `user_offline`

## 📡 API Endpoints

| | | |
|---|---|---|
| **Auth** | POST `/api/auth/register` | Register |
| | POST `/api/auth/login` | Login |
| | POST `/api/auth/logout` | Logout |
| **Users** | GET `/api/users/profile` | Mon profil |
| | GET `/api/users/online` | Utilisateurs online |
| | PUT `/api/users/flag-status` | Changer flag |
| **Subjects** | POST `/api/subjects` | Créer sujet |
| | GET `/api/subjects/active` | Sujets actifs |
| | GET `/api/subjects/my-subjects` | Mes sujets |
| | POST `/api/subjects/:id/join` | Rejoindre |
| **Messages** | POST `/api/messages` | Envoyer msg |
| | GET `/api/messages/subject/:id` | Historique |

## 🐳 Docker

```bash
docker-compose up -d
```

## 📊 Modèles

**User**: username, email, password, socketId, isOnline, lastSeen, flagStatus
**Subject**: title, creator, participants, isActive
**Message**: content, sender, subject, isRead

## 🔒 Auth

JWT - Token envoyé dans header `Authorization: Bearer <token>`

## 🛠 Tech Stack

- Express 4.18 | Mongoose 8.0 | Socket.IO 4.6
- JWT 9.0 | bcryptjs 2.4 | CORS 2.8
