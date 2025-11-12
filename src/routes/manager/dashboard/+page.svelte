<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllJobs } from '$lib/services/job';
	import { getStaffUsers } from '$lib/services/user';
	import { Plus, Calendar, Users, Briefcase, Clock } from 'lucide-svelte';
	import { format } from 'date-fns';
	import type { Job, User } from '$lib/types';

	let jobs: Job[] = [];
	let staff: User[] = [];
	let loading = true;

	onMount(async () => {
		try {
			[jobs, staff] = await Promise.all([getAllJobs(), getStaffUsers()]);
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	});

	$: upcomingJobs = jobs.filter((job) => {
		const startDate = job.dateTime.start.toDate();
		return startDate > new Date() && job.status !== 'cancelled';
	}).slice(0, 5);

	$: activeJobs = jobs.filter((job) => job.status === 'published').length;
	$: draftJobs = jobs.filter((job) => job.status === 'draft').length;
	$: completedJobs = jobs.filter((job) => job.status === 'completed').length;
</script>

<svelte:head>
	<title>Dashboard - CrewHub Manager</title>
</svelte:head>

<div>
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
			<p class="text-gray-600 mt-1">Overview of your workforce and jobs</p>
		</div>
		<a href="/manager/jobs/create" class="btn-primary flex items-center gap-2">
			<Plus class="w-5 h-5" />
			Create Job
		</a>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active Jobs</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{activeJobs}</p>
					</div>
					<div class="bg-green-100 p-3 rounded-full">
						<Briefcase class="w-6 h-6 text-green-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Draft Jobs</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{draftJobs}</p>
					</div>
					<div class="bg-yellow-100 p-3 rounded-full">
						<Clock class="w-6 h-6 text-yellow-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Completed Jobs</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{completedJobs}</p>
					</div>
					<div class="bg-blue-100 p-3 rounded-full">
						<Calendar class="w-6 h-6 text-blue-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Staff Members</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{staff.length}</p>
					</div>
					<div class="bg-purple-100 p-3 rounded-full">
						<Users class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Upcoming Jobs -->
		<div class="card">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold text-gray-900">Upcoming Jobs</h2>
				<a href="/manager/jobs" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
					View All
				</a>
			</div>

			{#if upcomingJobs.length === 0}
				<div class="text-center py-12">
					<Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600">No upcoming jobs</p>
					<a href="/manager/jobs/create" class="btn-primary mt-4 inline-flex items-center gap-2">
						<Plus class="w-4 h-4" />
						Create Your First Job
					</a>
				</div>
			{:else}
				<div class="space-y-4">
					{#each upcomingJobs as job}
						<a
							href="/manager/jobs/{job.id}"
							class="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
						>
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-semibold text-gray-900">{job.title}</h3>
								<span class="text-xs px-2 py-1 rounded-full {job.status === 'published'
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-800'}">
									{job.status}
								</span>
							</div>
							<p class="text-sm text-gray-600 mb-3">{job.location.address}</p>
							<div class="flex flex-wrap gap-4 text-sm text-gray-500">
								<div class="flex items-center gap-1">
									<Calendar class="w-4 h-4" />
									{format(job.dateTime.start.toDate(), 'MMM d, yyyy')}
								</div>
								<div class="flex items-center gap-1">
									<Clock class="w-4 h-4" />
									{format(job.dateTime.start.toDate(), 'h:mm a')} - {format(job.dateTime.end.toDate(), 'h:mm a')}
								</div>
								<div class="flex items-center gap-1">
									<Users class="w-4 h-4" />
									{job.assignedStaff.length}/{job.requiredStaff} assigned
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
