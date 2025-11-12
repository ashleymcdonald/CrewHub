import { writable } from 'svelte/store';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '$lib/types';

export const user = writable<FirebaseUser | null>(null);
export const userProfile = writable<User | null>(null);
export const loading = writable<boolean>(true);
