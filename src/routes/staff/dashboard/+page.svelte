<script lang="ts">
	import { onMount } from 'svelte';
	import { userProfile } from '$lib/stores/auth';
	import { getJobsForStaff } from '$lib/services/job';
	import { Calendar, Clock, MapPin, Briefcase, Navigation } from 'lucide-svelte';
	import { format, isToday, isTomorrow, isFuture, isPast } from 'date-fns';
	import type { Job } from '$lib/types';

	let jobs: Job[] = [];
	let loading = true;
	let profile: any = null;

	onMount(() => {
		const unsubscribe = userProfile.subscribe(async (p) => {
			profile = p;
			if (p) {
				try {
					jobs = await getJobsForStaff(p.uid);
				} catch (error) {
					console.error('Error loading jobs:', error);
				} finally {
					loading = false;
				}
			}
		});

		return () => unsubscribe();
	});

	$: upcomingJobs = jobs.filter((job) => {
		const startDate = job.dateTime.start.toDate();
		return isFuture(startDate) && job.status !== 'cancelled';
	}).sort((a, b) => a.dateTime.start.toMillis() - b.dateTime.start.toMillis());

	$: pastJobs = jobs.filter((job) => {
		const startDate = job.dateTime.start.toDate();
		return isPast(startDate);
	}).sort((a, b) => b.dateTime.start.toMillis() - a.dateTime.start.toMillis());

	function getDateLabel(date: Date): string {
		if (isToday(date)) return 'Today';
		if (isTomorrow(date)) return 'Tomorrow';
		return format(date, 'EEEE, MMMM d');
	}

	function openInMaps(address: string) {
		const encodedAddress = encodeURIComponent(address);
		window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
	}
</script>

<svelte:head>
	<title>My Schedule - CrewHub Staff</title>
</svelte:head>

<div>
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">My Schedule</h1>
		<p class="text-gray-600 mt-1">View your upcoming assignments</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
		</div>
	{:else}
		<!-- Quick Stats -->
		<div class="grid sm:grid-cols-3 gap-6 mb-8">
			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Upcoming Jobs</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{upcomingJobs.length}</p>
					</div>
					<div class="bg-green-100 p-3 rounded-full">
						<Calendar class="w-6 h-6 text-green-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Completed Jobs</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">
							{pastJobs.filter(j => j.status === 'completed').length}
						</p>
					</div>
					<div class="bg-blue-100 p-3 rounded-full">
						<Briefcase class="w-6 h-6 text-blue-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Assignments</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{jobs.length}</p>
					</div>
					<div class="bg-purple-100 p-3 rounded-full">
						<Calendar class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Upcoming Jobs -->
		<div class="card mb-8">
			<h2 class="text-xl font-bold text-gray-900 mb-6">Upcoming Assignments</h2>

			{#if upcomingJobs.length === 0}
				<div class="text-center py-12">
					<Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600">No upcoming assignments</p>
					<p class="text-gray-500 text-sm mt-2">Check back later for new job assignments</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each upcomingJobs as job}
						{@const startDate = job.dateTime.start.toDate()}
						{@const endDate = job.dateTime.end.toDate()}
						<div class="p-5 border-2 border-primary-200 bg-primary-50/30 rounded-lg hover:border-primary-300 transition-colors">
							<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-3">
										<h3 class="text-xl font-semibold text-gray-900">{job.title}</h3>
										<span class="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
											{job.status}
										</span>
									</div>

									<p class="text-gray-700 mb-4">{job.description}</p>

									<div class="grid sm:grid-cols-2 gap-3 text-sm">
										<div class="flex items-start gap-2 text-gray-700">
											<Calendar class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
											<div>
												<p class="font-medium">{getDateLabel(startDate)}</p>
												<p class="text-gray-600">{format(startDate, 'MMMM d, yyyy')}</p>
											</div>
										</div>

										<div class="flex items-start gap-2 text-gray-700">
											<Clock class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
											<div>
												<p class="font-medium">
													{format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
												</p>
												<p class="text-gray-600">
													{Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))} hours
												</p>
											</div>
										</div>
									</div>

									<div class="mt-3 flex items-start gap-2 text-gray-700">
										<MapPin class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600" />
										<div class="flex-1">
											<p class="font-medium">Location</p>
											<p class="text-gray-600">{job.location.address}</p>
										</div>
									</div>

									{#if job.requiredSkills.length > 0}
										<div class="mt-4 flex flex-wrap gap-2">
											{#each job.requiredSkills as skill}
												<span class="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
													{skill}
												</span>
											{/each}
										</div>
									{/if}
								</div>

								<button
									on:click={() => openInMaps(job.location.address)}
									class="btn-primary flex items-center gap-2 whitespace-nowrap"
								>
									<Navigation class="w-4 h-4" />
									Get Directions
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Past Jobs -->
		{#if pastJobs.length > 0}
			<div class="card">
				<h2 class="text-xl font-bold text-gray-900 mb-6">Past Assignments</h2>

				<div class="space-y-3">
					{#each pastJobs.slice(0, 5) as job}
						{@const startDate = job.dateTime.start.toDate()}
						<div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<h3 class="font-semibold text-gray-900">{job.title}</h3>
										<span class="text-xs px-2 py-1 {job.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} rounded-full">
											{job.status}
										</span>
									</div>
									<div class="flex flex-wrap gap-4 text-sm text-gray-600">
										<div class="flex items-center gap-1">
											<Calendar class="w-4 h-4" />
											{format(startDate, 'MMM d, yyyy')}
										</div>
										<div class="flex items-center gap-1">
											<MapPin class="w-4 h-4" />
											{job.location.address}
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
