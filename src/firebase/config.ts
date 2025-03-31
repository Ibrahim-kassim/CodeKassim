// Import the functions i need from the SDKs i need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// My web app Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAEHnTrhixqv2U3afK8-SH0E21ppDon4ZA',
  authDomain: 'upload-images-c99c6.firebaseapp.com',
  projectId: 'upload-images-c99c6',
  storageBucket: 'upload-images-c99c6.appspot.com',
  messagingSenderId: '636494017951',
  appId: '1:636494017951:web:a7d74691bf525c1d80f9aa',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize storage
const storage = getStorage(firebaseApp);

// Initialize auth
const auth = getAuth(firebaseApp);

export { firebaseApp, storage, auth };
