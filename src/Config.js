// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAu0Vg3pTg_txit8b2jXLwoZ8R-XW49Jko",
    authDomain: "maintenancerequest-d55f7.firebaseapp.com",
    projectId: "maintenancerequest-d55f7",
    storageBucket: "maintenancerequest-d55f7.appspot.com",
    messagingSenderId: "814382777696",
    appId: "1:814382777696:web:f0fc5ee1baa98a500a8a05",
    measurementId: "G-H5T6TKP04W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);

