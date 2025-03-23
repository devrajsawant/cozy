import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD1MMwhm0tY7skUVsjOTllP14BAvcvdxMA",
    authDomain: "cozy-31d21.firebaseapp.com",
    projectId: "cozy-31d21",
    storageBucket: "cozy-31d21.firebasestorage.app",
    messagingSenderId: "147913965771",
    appId: "1:147913965771:web:502fb75917cb924ecfdb4e",
    measurementId: "G-MG6JPHZG8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
