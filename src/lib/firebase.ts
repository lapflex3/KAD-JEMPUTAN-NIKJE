import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

let db: any = null;

export function getClientDb() {
  if (!db) {
    try {
      const app = initializeApp(firebaseConfig);
      if (firebaseConfig.firestoreDatabaseId) {
        db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      } else {
        db = getFirestore(app);
      }
      console.log("Firebase client-side initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Firebase on client-side:", error);
    }
  }
  return db;
}
