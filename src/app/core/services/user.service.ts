import { Injectable } from '@angular/core';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  async ensureUserDoc(userId: string, name: string, email: string): Promise<void> {
    await setDoc(doc(firestore, 'users', userId), { name, email }, { merge: true });
  }
}
