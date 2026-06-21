import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBs_w2txuAvnWG9QJpHnCly43xYONeBooY",
  authDomain: "schedule-app-4eb06.firebaseapp.com",
  projectId: "schedule-app-4eb06",
  storageBucket: "schedule-app-4eb06.firebasestorage.app",
  messagingSenderId: "969874593524",
  appId: "1:969874593524:web:421d60cb58bc31136030a1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
