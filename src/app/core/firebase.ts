import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../env';

export const firebaseApp = getApps().length ? getApp() : initializeApp(environment.firebase);
export const firestore = getFirestore(firebaseApp);

//later for auth
import { getAuth } from 'firebase/auth';
export const auth = getAuth(firebaseApp);
