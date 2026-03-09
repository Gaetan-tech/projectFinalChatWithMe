const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('🔍 MONGODB_URI:', uri);
  
  // Retry logic - MongoDB peut prendre du temps à démarrer
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.log(`⏳ Tentative ${i + 1}/${maxRetries} - MongoDB pas encore prêt...`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Attendre 3 secondes
      } else {
        console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;