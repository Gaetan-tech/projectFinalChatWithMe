import { Redirect } from 'expo-router';

export default function Index() {
  // Redirection simple vers login
  // Le AuthProvider dans _layout.js gérera l'authentification
  return <Redirect href="/(auth)/login" />;
}