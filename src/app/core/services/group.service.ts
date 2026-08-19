import { Injectable } from '@angular/core';
import {
  arrayUnion,
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '../firebase';

export interface Group {
  id: string;
  name: string;
  joinCode: string;
  unavailabilityThreshold: number;
}

function generateJoinCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  async createGroup(
    name: string,
    userId: string,
    unavailabilityThreshold: number,
  ): Promise<string> {
    const groupRef = doc(collection(firestore, 'groups'));
    const batch = writeBatch(firestore);
    batch.set(groupRef, {
      name,
      memberIds: [userId],
      joinCode: generateJoinCode(),
      unavailabilityThreshold,
    });
    batch.set(
      doc(firestore, 'users', userId),
      { groupIds: arrayUnion(groupRef.id) },
      { merge: true },
    );
    await batch.commit();
    return groupRef.id;
  }

  async joinGroup(joinCode: string, userId: string): Promise<string> {
    const q = query(collection(firestore, 'groups'), where('joinCode', '==', joinCode));
    const snapshot = await getDocsFromServer(q);
    const groupDoc = snapshot.docs[0];
    if (!groupDoc) {
      throw new Error('Code invalide');
    }

    const batch = writeBatch(firestore);
    batch.update(groupDoc.ref, { memberIds: arrayUnion(userId) });
    batch.set(
      doc(firestore, 'users', userId),
      { groupIds: arrayUnion(groupDoc.id) },
      { merge: true },
    );
    await batch.commit();
    return groupDoc.id;
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const userSnap = await getDocFromServer(doc(firestore, 'users', userId));
    const groupIds = (userSnap.data()?.['groupIds'] as string[]) ?? [];

    return Promise.all(
      groupIds.map(async (id) => {
        const snap = await getDocFromServer(doc(firestore, 'groups', id));
        return {
          id,
          name: (snap.data()?.['name'] as string) ?? id,
          joinCode: (snap.data()?.['joinCode'] as string) ?? '',
          unavailabilityThreshold: (snap.data()?.['unavailabilityThreshold'] as number) ?? 1,
        };
      }),
    );
  }
}
