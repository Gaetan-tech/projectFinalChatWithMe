# 📱 ChatWithMe

Application mobile de chat anonyme avec système de **flags** pour connecter utilisateurs et contributeurs.

## 🎯 Concept

- 🔴 **Red Flag** : Cherche de l'aide sur un sujet
- 🟢 **Green Flag** : Disponible pour aider
- 💬 Conversation directe entre utilisateurs

## ✨ Fonctionnalités

- ✅ Authentification sécurisée
- ✅ Création/consultation de sujets
- ✅ Messagerie temps réel (WebSocket)
- ✅ Profils utilisateurs
- ✅ Mode clair/sombre
- ✅ Multilingue (FR/EN)
- ✅ Notifications locales

## 🚀 Stack

- **React Native** + Expo
- **Expo Router** (navigation)
- **Socket.io** (real-time)
- **Axios** (API calls)
- **i18next** (i18n)

## 📦 Installation

```bash
npm install
npm start
```

## 📁 Structure

```
app/                 # Routing
src/
  ├── api/          # Appels API
  ├── contexts/     # State management
  ├── components/   # Composants UI
  ├── hooks/        # Hooks custom
  ├── i18n/         # Traductions
  └── theme/        # Thème & styles
```

## 🔗 Backend API

`http://192.168.1.108:5000/api` (DEV)

## 📝 License

© 2025 ChatWithMe