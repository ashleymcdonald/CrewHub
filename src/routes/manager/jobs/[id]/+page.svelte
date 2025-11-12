<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getJob, updateJob, assignStaffToJob, deleteJob } from '$lib/services/job';
	import { getStaffUsers, getUserProfile } from '$lib/services/user';
	import { MapPin, Calendar, Clock, Users, Tag, Edit, Trash2, CheckCircle, XCircle } from 'lucide-svelte';
	import { format } from 'date-fns';
	import type { Job, User } from '$lib/types';

	let job: Job | null = null;
	let allStaff: User[] = [];
	let assignedStaffDetails: User[] = [];
	let loading = true;
	let showAssignModal = false;
	let selectedStaff: string[] = [];

	$: jobId = $page.params.id as string;

	onMount(async () => {
		try {
			[job, allStaff] = await Promise.all([
				getJob(jobId),
				getStaffUsers()
			]);

			if (job) {
				selectedStaff = [...job.assignedStaff];
				// Load assigned staff details
				assignedStaffDetails = await Promise.all(
					job.assignedStaff.map(uid => getUserProfile(uid))
				).then(profiles => profiles.filter(p => p !== null) as User[]);
			}
		} catch (error) {
			console.error('Error loading job:', error);
		} finally {
			loading = false;
		}
	});

	async function handlePublish() {
		if (!job) return;
		try {
			await updateJob(jobId, { status: 'published' });
			job.status = 'published';
		} catch (error) {
			console.error('Error publishing job:', error);
		}
	}

	async function handleComplete() {
		if (!job) return;
		try {
			await updateJob(jobId, { status: 'completed' });
			job.status = 'completed';
		} catch (error) {
			console.error('Error completing job:', error);
		}
	}

	async function handleDelete() {
		if (!job || !confirm('Are you sure you want to delete this job?')) return;
		try {
			await deleteJob(jobId);
			goto('/manager/jobs');
		} catch (error) {
			console.error('Error deleting job:', error);
		}
	}

	function toggleStaffSelection(uid: string) {
		if (selectedStaff.includes(uid)) {
			selectedStaff = selectedStaff.filter(id => id !== uid);
		} else {
			selectedStaff = [...selectedStaff, uid];
		}
	}

	async function handleAssignStaff() {
		try {
			await assignStaffToJob(jobId, selectedStaff);
			if (job) {
				job.assignedStaff = selectedStaff;
				assignedStaffDetails = await Promise.all(
					selectedStaff.map(uid => getUserProfile(uid))
				).then(profiles => profiles.filter(p => p !== null) as User[]);
			}
			showAssignModal = false;
		} catch (error) {
			console.error('Error assigning staff:', error);
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'published':
				return 'bg-green-100 text-green-800';
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>{job?.title || 'Job Details'} - CrewHub Manager</title>
</svelte:head>

{#if loading}
	<div class="flex items-center justify-center py-12">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
	</div>
{:else if !job}
	<div class="card text-center py-12">
		<p class="text-gray-600 mb-4">Job not found</p>
		<a href="/manager/jobs" class="btn-primary">Back to Jobs</a>
	</div>
{:else}
	<div class="max-w-5xl mx-auto">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
			<div>
				<div class="flex items-center gap-3 mb-2">
					<h1 class="text-3xl font-bold text-gray-900">{job.title}</h1>
					<span class="text-xs px-3 py-1 rounded-full font-medium {getStatusColor(job.status)}">
						{job.status}
					</span>
				</div>
				<p class="text-gray-600">Job Details and Staff Assignment</p>
			</div>
			<div class="flex gap-2">
				<button on:click={handleDelete} class="btn-danger flex items-center gap-2">
					<Trash2 class="w-4 h-4" />
					Delete
				</button>
			</div>
		</div>

		<div class="grid lg:grid-cols-3 gap-6">
			<!-- Job Details -->
			<div class="lg:col-span-2 space-y-6">
				<div class="card">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Job Information</h2>
					<div class="space-y-4">
						<div>
							<p class="text-sm font-medium text-gray-600 mb-1">Description</p>
							<p class="text-gray-900">{job.description}</p>
						</div>

						<div>
							<p class="text-sm font-medium text-gray-600 mb-2">
								<MapPin class="w-4 h-4 inline mr-1" />
								Location
							</p>
							<p class="text-gray-900">{job.location.address}</p>
						</div>

						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<p class="text-sm font-medium text-gray-600 mb-2">
									<Calendar class="w-4 h-4 inline mr-1" />
									Start
								</p>
								<p class="text-gray-900">
									{format(job.dateTime.start.toDate(), 'MMMM d, yyyy')}
								</p>
								<p class="text-gray-600 text-sm">
									{format(job.dateTime.start.toDate(), 'h:mm a')}
								</p>
							</div>

							<div>
								<p class="text-sm font-medium text-gray-600 mb-2">
									<Clock class="w-4 h-4 inline mr-1" />
									End
								</p>
								<p class="text-gray-900">
									{format(job.dateTime.end.toDate(), 'MMMM d, yyyy')}
								</p>
								<p class="text-gray-600 text-sm">
									{format(job.dateTime.end.toDate(), 'h:mm a')}
								</p>
							</div>
						</div>

						{#if job.requiredSkills.length > 0}
							<div>
								<p class="text-sm font-medium text-gray-600 mb-2">
									<Tag class="w-4 h-4 inline mr-1" />
									Required Skills
								</p>
								<div class="flex flex-wrap gap-2">
									{#each job.requiredSkills as skill}
										<span class="text-sm px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
											{skill}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Assigned Staff -->
				<div class="card">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-lg font-semibold text-gray-900">
							<Users class="w-5 h-5 inline mr-2" />
							Assigned Staff ({job.assignedStaff.length}/{job.requiredStaff})
						</h2>
						<button
							on:click={() => showAssignModal = true}
							class="btn-primary text-sm"
						>
							Assign Staff
						</button>
					</div>

					{#if assignedStaffDetails.length === 0}
						<p class="text-gray-600 text-sm">No staff assigned yet</p>
					{:else}
						<div class="space-y-3">
							{#each assignedStaffDetails as staff}
								<div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
									<div>
										<p class="font-medium text-gray-900">{staff.name}</p>
										<p class="text-sm text-gray-600">{staff.email}</p>
									</div>
									{#if staff.skills.length > 0}
										<div class="flex flex-wrap gap-1">
											{#each staff.skills.slice(0, 3) as skill}
												<span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
													{skill}
												</span>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Actions -->
			<div class="space-y-6">
				<div class="card">
					<h3 class="font-semibold text-gray-900 mb-4">Actions</h3>
					<div class="space-y-3">
						{#if job.status === 'draft'}
							<button
								on:click={handlePublish}
								class="btn-primary w-full flex items-center justify-center gap-2"
							>
								<CheckCircle class="w-4 h-4" />
								Publish Job
							</button>
						{/if}

						{#if job.status === 'published'}
							<button
								on:click={handleComplete}
								class="btn-primary w-full flex items-center justify-center gap-2"
							>
								<CheckCircle class="w-4 h-4" />
								Mark as Completed
							</button>
						{/if}

						<a href="/manager/jobs" class="btn-secondary w-full block text-center">
							Back to Jobs
						</a>
					</div>
				</div>

				<div class="card">
					<h3 class="font-semibold text-gray-900 mb-4">Staff Coverage</h3>
					<div class="space-y-2">
						<div class="flex justify-between text-sm">
							<span class="text-gray-600">Required:</span>
							<span class="font-medium text-gray-900">{job.requiredStaff}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-gray-600">Assigned:</span>
							<span class="font-medium {job.assignedStaff.length >= job.requiredStaff ? 'text-green-600' : 'text-yellow-600'}">
								{job.assignedStaff.length}
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-gray-600">Remaining:</span>
							<span class="font-medium text-gray-900">
								{Math.max(0, job.requiredStaff - job.assignedStaff.length)}
							</span>
						</div>
					</div>
					<div class="mt-4 w-full bg-gray-200 rounded-full h-2">
						<div
							class="bg-primary-600 h-2 rounded-full transition-all"
							style="width: {Math.min(100, (job.assignedStaff.length / job.requiredStaff) * 100)}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Assign Staff Modal -->
{#if showAssignModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" on:click={() => showAssignModal = false}>
		<div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden" on:click|stopPropagation>
			<div class="p-6 border-b border-gray-200">
				<h2 class="text-xl font-bold text-gray-900">Assign Staff to Job</h2>
				<p class="text-sm text-gray-600 mt-1">Select staff members for this assignment</p>
			</div>

			<div class="p-6 overflow-y-auto max-h-[50vh]">
				<div class="space-y-2">
					{#each allStaff as staff}
						<label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
							<input
								type="checkbox"
								checked={selectedStaff.includes(staff.uid)}
								on:change={() => toggleStaffSelection(staff.uid)}
								class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<div class="ml-3 flex-1">
								<p class="font-medium text-gray-900">{staff.name}</p>
								<p class="text-sm text-gray-600">{staff.email}</p>
								{#if staff.skills.length > 0}
									<div class="flex flex-wrap gap-1 mt-1">
										{#each staff.skills as skill}
											<span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
												{skill}
											</span>
										{/each}
									</div>
								{/if}
							</div>
						</label>
					{/each}
				</div>
			</div>

			<div class="p-6 border-t border-gray-200 flex gap-3">
				<button on:click={handleAssignStaff} class="btn-primary flex-1">
					Assign {selectedStaff.length} Staff
				</button>
				<button on:click={() => showAssignModal = false} class="btn-secondary">
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
