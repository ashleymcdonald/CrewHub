import {
	collection,
	doc,
	addDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
	Timestamp
} from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { Job, CreateJobInput, UpdateJobInput, JobStatus } from '$lib/types';

export async function createJob(data: CreateJobInput, userId: string): Promise<string> {
	try {
		const jobRef = await addDoc(collection(db, 'jobs'), {
			...data,
			dateTime: {
				start: Timestamp.fromDate(data.dateTime.start),
				end: Timestamp.fromDate(data.dateTime.end)
			},
			assignedStaff: [],
			status: 'draft' as JobStatus,
			createdBy: userId,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		return jobRef.id;
	} catch (error) {
		console.error('Error creating job:', error);
		throw new Error('Failed to create job');
	}
}

export async function getJob(jobId: string): Promise<Job | null> {
	try {
		const jobDoc = await getDoc(doc(db, 'jobs', jobId));
		if (jobDoc.exists()) {
			return { id: jobDoc.id, ...jobDoc.data() } as Job;
		}
		return null;
	} catch (error) {
		console.error('Error fetching job:', error);
		return null;
	}
}

export async function getAllJobs(): Promise<Job[]> {
	try {
		const q = query(collection(db, 'jobs'), orderBy('dateTime.start', 'desc'));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job));
	} catch (error) {
		console.error('Error fetching jobs:', error);
		return [];
	}
}

export async function getJobsByStatus(status: JobStatus): Promise<Job[]> {
	try {
		const q = query(
			collection(db, 'jobs'),
			where('status', '==', status),
			orderBy('dateTime.start', 'desc')
		);
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job));
	} catch (error) {
		console.error('Error fetching jobs by status:', error);
		return [];
	}
}

export async function getJobsForStaff(userId: string): Promise<Job[]> {
	try {
		const q = query(
			collection(db, 'jobs'),
			where('assignedStaff', 'array-contains', userId),
			orderBy('dateTime.start', 'desc')
		);
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job));
	} catch (error) {
		console.error('Error fetching jobs for staff:', error);
		return [];
	}
}

export async function updateJob(jobId: string, data: UpdateJobInput): Promise<void> {
	try {
		const jobRef = doc(db, 'jobs', jobId);
		const updateData: any = { ...data, updatedAt: serverTimestamp() };

		// Convert dates to Timestamps if provided
		if (data.dateTime) {
			updateData.dateTime = {
				start: Timestamp.fromDate(data.dateTime.start),
				end: Timestamp.fromDate(data.dateTime.end)
			};
		}

		await updateDoc(jobRef, updateData);
	} catch (error) {
		console.error('Error updating job:', error);
		throw new Error('Failed to update job');
	}
}

export async function assignStaffToJob(jobId: string, staffIds: string[]): Promise<void> {
	try {
		const jobRef = doc(db, 'jobs', jobId);
		await updateDoc(jobRef, {
			assignedStaff: staffIds,
			updatedAt: serverTimestamp()
		});
	} catch (error) {
		console.error('Error assigning staff to job:', error);
		throw new Error('Failed to assign staff');
	}
}

export async function deleteJob(jobId: string): Promise<void> {
	try {
		await deleteDoc(doc(db, 'jobs', jobId));
	} catch (error) {
		console.error('Error deleting job:', error);
		throw new Error('Failed to delete job');
	}
}
