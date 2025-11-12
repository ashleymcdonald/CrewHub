import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	sendPasswordResetEmail,
	updateProfile,
	type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '$lib/firebase';
import type { UserRole } from '$lib/types';

export interface SignUpData {
	email: string;
	password: string;
	name: string;
	phone?: string;
	role: UserRole;
}

export async function signUp(data: SignUpData): Promise<FirebaseUser> {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
		const user = userCredential.user;

		// Update profile with display name
		await updateProfile(user, { displayName: data.name });

		// Create user document in Firestore
		await setDoc(doc(db, 'users', user.uid), {
			uid: user.uid,
			email: data.email,
			name: data.name,
			phone: data.phone || '',
			role: data.role,
			skills: [],
			availability: {},
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});

		return user;
	} catch (error: any) {
		throw new Error(error.message || 'Failed to create account');
	}
}

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	} catch (error: any) {
		throw new Error(error.message || 'Failed to sign in');
	}
}

export async function signOut(): Promise<void> {
	try {
		await firebaseSignOut(auth);
	} catch (error: any) {
		throw new Error(error.message || 'Failed to sign out');
	}
}

export async function resetPassword(email: string): Promise<void> {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error: any) {
		throw new Error(error.message || 'Failed to send password reset email');
	}
}
