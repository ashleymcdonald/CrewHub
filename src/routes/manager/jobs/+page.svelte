<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllJobs } from '$lib/services/job';
	import { Plus, Calendar, Clock, Users, MapPin, Filter } from 'lucide-svelte';
	import { format } from 'date-fns';
	import type { Job, JobStatus } from '$lib/types';

	let jobs: Job[] = [];
	let loading = true;
	let filterStatus: JobStatus | 'all' = 'all';

	onMount(async () => {
		try {
			jobs = await getAllJobs();
		} catch (error) {
			console.error('Error loading jobs:', error);
		} finally {
			loading = false;
		}
	});

	$: filteredJobs = filterStatus === 'all'
		? jobs
		: jobs.filter(job => job.status === filterStatus);

	function getStatusColor(status: JobStatus): string {
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
	<title>Jobs - CrewHub Manager</title>
</svelte:head>

<div>
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Jobs</h1>
			<p class="text-gray-600 mt-1">Manage all your job assignments</p>
		</div>
		<a href="/manager/jobs/create" class="btn-primary flex items-center gap-2">
			<Plus class="w-5 h-5" />
			Create Job
		</a>
	</div>

	<!-- Filters -->
	<div class="card mb-6">
		<div class="flex items-center gap-2 flex-wrap">
			<Filter class="w-5 h-5 text-gray-500" />
			<span class="text-sm font-medium text-gray-700">Filter:</span>
			<div class="flex gap-2 flex-wrap">
				<button
					on:click={() => filterStatus = 'all'}
					class="px-3 py-1 rounded-full text-sm font-medium transition-colors {filterStatus === 'all'
						? 'bg-primary-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					All
				</button>
				<button
					on:click={() => filterStatus = 'published'}
					class="px-3 py-1 rounded-full text-sm font-medium transition-colors {filterStatus === 'published'
						? 'bg-green-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					Published
				</button>
				<button
					on:click={() => filterStatus = 'draft'}
					class="px-3 py-1 rounded-full text-sm font-medium transition-colors {filterStatus === 'draft'
						? 'bg-gray-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					Draft
				</button>
				<button
					on:click={() => filterStatus = 'completed'}
					class="px-3 py-1 rounded-full text-sm font-medium transition-colors {filterStatus === 'completed'
						? 'bg-blue-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					Completed
				</button>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
		</div>
	{:else if filteredJobs.length === 0}
		<div class="card text-center py-12">
			<Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
			<p class="text-gray-600 mb-4">
				{filterStatus === 'all' ? 'No jobs found' : `No ${filterStatus} jobs`}
			</p>
			{#if filterStatus === 'all'}
				<a href="/manager/jobs/create" class="btn-primary inline-flex items-center gap-2">
					<Plus class="w-4 h-4" />
					Create Your First Job
				</a>
			{/if}
		</div>
	{:else}
		<div class="grid gap-4">
			{#each filteredJobs as job}
				<a href="/manager/jobs/{job.id}" class="card hover:shadow-lg transition-shadow">
					<div class="flex justify-between items-start mb-4">
						<div class="flex-1">
							<h3 class="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
							<p class="text-gray-600 text-sm line-clamp-2">{job.description}</p>
						</div>
						<span class="text-xs px-3 py-1 rounded-full font-medium {getStatusColor(job.status)} ml-4">
							{job.status}
						</span>
					</div>

					<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
						<div class="flex items-center gap-2 text-gray-600">
							<MapPin class="w-4 h-4 flex-shrink-0" />
							<span class="truncate">{job.location.address}</span>
						</div>
						<div class="flex items-center gap-2 text-gray-600">
							<Calendar class="w-4 h-4 flex-shrink-0" />
							{format(job.dateTime.start.toDate(), 'MMM d, yyyy')}
						</div>
						<div class="flex items-center gap-2 text-gray-600">
							<Clock class="w-4 h-4 flex-shrink-0" />
							{format(job.dateTime.start.toDate(), 'h:mm a')}
						</div>
						<div class="flex items-center gap-2 text-gray-600">
							<Users class="w-4 h-4 flex-shrink-0" />
							{job.assignedStaff.length}/{job.requiredStaff} staff
						</div>
					</div>

					{#if job.requiredSkills.length > 0}
						<div class="mt-3 flex flex-wrap gap-2">
							{#each job.requiredSkills as skill}
								<span class="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">
									{skill}
								</span>
							{/each}
						</div>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
