import { doc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { User, UserRole } from '$lib/types';

export async function getUserProfile(uid: string): Promise<User | null> {
	try {
		const userDoc = await getDoc(doc(db, 'users', uid));
		if (userDoc.exists()) {
			return userDoc.data() as User;
		}
		return null;
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return null;
	}
}

export async function updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
	try {
		const userRef = doc(db, 'users', uid);
		await updateDoc(userRef, {
			...data,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error('Error updating user profile:', error);
		throw new Error('Failed to update profile');
	}
}

export async function getStaffUsers(): Promise<User[]> {
	try {
		const q = query(collection(db, 'users'), where('role', '==', 'staff'));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => doc.data() as User);
	} catch (error) {
		console.error('Error fetching staff users:', error);
		return [];
	}
}

export async function getAllUsers(): Promise<User[]> {
	try {
		const querySnapshot = await getDocs(collection(db, 'users'));
		return querySnapshot.docs.map((doc) => doc.data() as User);
	} catch (error) {
		console.error('Error fetching all users:', error);
		return [];
	}
}
