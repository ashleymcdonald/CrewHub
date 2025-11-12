import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'manager' | 'staff';

export interface User {
	uid: string;
	email: string;
	name: string;
	phone?: string;
	role: UserRole;
	skills: string[];
	availability: Record<string, boolean>;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export type JobStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface Job {
	id: string;
	title: string;
	description: string;
	location: {
		address: string;
		coordinates?: {
			lat: number;
			lng: number;
		};
	};
	dateTime: {
		start: Timestamp;
		end: Timestamp;
	};
	requiredStaff: number;
	assignedStaff: string[];
	requiredSkills: string[];
	status: JobStatus;
	createdBy: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export type AssignmentStatus = 'pending' | 'confirmed' | 'declined' | 'completed';

export interface Assignment {
	id: string;
	jobId: string;
	userId: string;
	status: AssignmentStatus;
	confirmedAt?: Timestamp;
	completedAt?: Timestamp;
	notes?: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export interface Notification {
	id: string;
	userId: string;
	title: string;
	message: string;
	type: 'assignment' | 'update' | 'reminder' | 'cancellation';
	read: boolean;
	actionUrl?: string;
	createdAt: Timestamp;
}

export interface CreateJobInput {
	title: string;
	description: string;
	location: {
		address: string;
		coordinates?: {
			lat: number;
			lng: number;
		};
	};
	dateTime: {
		start: Date;
		end: Date;
	};
	requiredStaff: number;
	requiredSkills: string[];
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
	status?: JobStatus;
	assignedStaff?: string[];
}
