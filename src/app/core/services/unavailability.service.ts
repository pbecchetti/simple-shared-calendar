import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class UnavailabilityService {
  async toggle(userId: string, dateStr: string): Promise<void> {
    const ref = doc(firestore, 'unavailabilities', `${dateStr}_${userId}`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { userId, dateStr });
    }
  }

  async getUnavailableUserIds(dateStr: string): Promise<string[]> {
    const q = query(collection(firestore, 'unavailabilities'), where('dateStr', '==', dateStr));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data()['userId'] as string);
  }
}
