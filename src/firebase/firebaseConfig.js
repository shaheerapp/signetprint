import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyANWHNjYyX6rdXEHm6vtJbE6Vzw3md0WQQ",
    authDomain: "https://signetprint.co.za/",
    projectId: "print-hub-4es1ey",
    storageBucket: "print-hub-4es1ey.appspot.com",
    messagingSenderId: "112114917401",
    appId: "1:112114917401:web:de2a75837d1caba0b24a88"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
