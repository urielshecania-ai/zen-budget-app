### Étape 1 : Créer un projet Firebase

1. **Accédez à la console Firebase** : Allez sur [Firebase Console](https://console.firebase.google.com/).
2. **Créer un nouveau projet** : Cliquez sur "Ajouter un projet" et suivez les instructions pour créer un nouveau projet.
3. **Configurer Google Analytics** (optionnel) : Vous pouvez choisir d'activer ou non Google Analytics pour votre projet.

### Étape 2 : Ajouter Firebase à votre projet

1. **Ajouter une application** : Dans votre projet Firebase, cliquez sur l'icône Web (</>) pour ajouter une application web.
2. **Obtenez les configurations Firebase** : Une fois l'application ajoutée, vous obtiendrez un code de configuration Firebase. Copiez ce code, car vous en aurez besoin pour votre projet.

### Étape 3 : Installer Firebase dans votre projet

1. **Installer Firebase** : Si vous utilisez npm, exécutez la commande suivante dans votre terminal à la racine de votre projet :
   ```bash
   npm install firebase
   ```

### Étape 4 : Configurer Firebase dans votre projet

1. **Créer un fichier de configuration** : Créez un fichier `firebase.js` (ou un nom similaire) dans votre projet et collez-y le code de configuration que vous avez copié précédemment.
   ```javascript
   // firebase.js
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";

   const firebaseConfig = {
       apiKey: "VOTRE_API_KEY",
       authDomain: "VOTRE_AUTH_DOMAIN",
       projectId: "VOTRE_PROJECT_ID",
       storageBucket: "VOTRE_STORAGE_BUCKET",
       messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
       appId: "VOTRE_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);

   export { auth };
   ```

### Étape 5 : Mettre en place l'authentification

1. **Activer les méthodes d'authentification** : Dans la console Firebase, allez dans la section "Authentication" et activez les méthodes d'authentification que vous souhaitez utiliser (par exemple, Email/Password).
2. **Créer une page de connexion** : Créez une page de connexion dans votre projet. Voici un exemple simple :
   ```html
   <!-- login.html -->
   <form id="login-form">
       <input type="email" id="email" placeholder="Email" required>
       <input type="password" id="password" placeholder="Mot de passe" required>
       <button type="submit">Se connecter</button>
   </form>

   <script type="module">
       import { auth } from './firebase.js';
       import { signInWithEmailAndPassword } from "firebase/auth";

       const form = document.getElementById('login-form');

       form.addEventListener('submit', (e) => {
           e.preventDefault();

           const email = document.getElementById('email').value;
           const password = document.getElementById('password').value;

           signInWithEmailAndPassword(auth, email, password)
               .then((userCredential) => {
                   // Connexion réussie
                   const user = userCredential.user;
                   console.log('Utilisateur connecté:', user);
               })
               .catch((error) => {
                   const errorCode = error.code;
                   const errorMessage = error.message;
                   console.error('Erreur de connexion:', errorCode, errorMessage);
               });
       });
   </script>
   ```

### Étape 6 : Tester votre application

1. **Lancer votre application** : Ouvrez votre page de connexion dans un navigateur et testez le système d'authentification en utilisant un compte que vous avez créé dans la console Firebase.

### Étape 7 : Déployer votre application

1. **Utiliser Firebase Hosting** : Si vous souhaitez déployer votre application, vous pouvez utiliser Firebase Hosting. Installez Firebase CLI si ce n'est pas déjà fait :
   ```bash
   npm install -g firebase-tools
   ```
2. **Initialiser Firebase dans votre projet** :
   ```bash
   firebase init
   ```
   Suivez les instructions pour configurer Firebase Hosting.
3. **Déployer votre application** :
   ```bash
   firebase deploy
   ```

### Conclusion

Vous avez maintenant intégré Firebase à votre projet local et mis en place un système d'authentification avec une page de connexion. Vous pouvez personnaliser davantage votre application en ajoutant des fonctionnalités comme l'inscription, la réinitialisation de mot de passe, etc.