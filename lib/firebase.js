import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSljFrW8LRfGKGlNMslADFS5eil20_ZS4",
  authDomain: "testdbnosql.firebaseapp.com",
  projectId: "testdbnosql",
  storageBucket: "testdbnosql.firebasestorage.app",
  messagingSenderId: "310680659215",
  appId: "1:310680659215:web:94443d0f0ab12507fb8a7a",
  measurementId: "G-95DGG2GLYW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);