<script lang="ts">
	import { goto } from '$app/navigation';
	import { createJob } from '$lib/services/job';
	import { user } from '$lib/stores/auth';
	import { MapPin, Calendar, Clock, Users, FileText, Tag, AlertCircle } from 'lucide-svelte';
	import type { CreateJobInput } from '$lib/types';

	let title = '';
	let description = '';
	let address = '';
	let startDate = '';
	let startTime = '';
	let endDate = '';
	let endTime = '';
	let requiredStaff = 1;
	let skillsInput = '';
	let error = '';
	let loading = false;

	$: skills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

	async function handleSubmit() {
		if (!title || !description || !address || !startDate || !startTime || !endDate || !endTime) {
			error = 'Please fill in all required fields';
			return;
		}

		if (requiredStaff < 1) {
			error = 'Required staff must be at least 1';
			return;
		}

		const start = new Date(`${startDate}T${startTime}`);
		const end = new Date(`${endDate}T${endTime}`);

		if (end <= start) {
			error = 'End date/time must be after start date/time';
			return;
		}

		loading = true;
		error = '';

		try {
			const jobData: CreateJobInput = {
				title,
				description,
				location: {
					address
				},
				dateTime: {
					start,
					end
				},
				requiredStaff,
				requiredSkills: skills
			};

			const jobId = await createJob(jobData, $user!.uid);
			goto(`/manager/jobs/${jobId}`);
		} catch (err: any) {
			error = err.message || 'Failed to create job';
			loading = false;
		}
	}

	// Set default dates to today
	const today = new Date();
	startDate = today.toISOString().split('T')[0];
	endDate = today.toISOString().split('T')[0];
</script>

<svelte:head>
	<title>Create Job - CrewHub Manager</title>
</svelte:head>

<div class="max-w-3xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Create New Job</h1>
		<p class="text-gray-600 mt-1">Fill in the details for your new job assignment</p>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
			<AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
			<p class="text-red-800 text-sm">{error}</p>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div class="card">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

			<div class="space-y-4">
				<div>
					<label for="title" class="label">
						<FileText class="w-4 h-4 inline mr-2" />
						Job Title
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						class="input"
						placeholder="e.g., Weekend Event Staff"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="description" class="label">
						Description
					</label>
					<textarea
						id="description"
						bind:value={description}
						class="input min-h-[100px]"
						placeholder="Provide details about the job requirements and responsibilities..."
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="address" class="label">
						<MapPin class="w-4 h-4 inline mr-2" />
						Location Address
					</label>
					<input
						id="address"
						type="text"
						bind:value={address}
						class="input"
						placeholder="123 Main St, City, State 12345"
						required
						disabled={loading}
					/>
				</div>
			</div>
		</div>

		<div class="card">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>

			<div class="grid sm:grid-cols-2 gap-4">
				<div>
					<label for="startDate" class="label">
						<Calendar class="w-4 h-4 inline mr-2" />
						Start Date
					</label>
					<input
						id="startDate"
						type="date"
						bind:value={startDate}
						class="input"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="startTime" class="label">
						<Clock class="w-4 h-4 inline mr-2" />
						Start Time
					</label>
					<input
						id="startTime"
						type="time"
						bind:value={startTime}
						class="input"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="endDate" class="label">
						<Calendar class="w-4 h-4 inline mr-2" />
						End Date
					</label>
					<input
						id="endDate"
						type="date"
						bind:value={endDate}
						class="input"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="endTime" class="label">
						<Clock class="w-4 h-4 inline mr-2" />
						End Time
					</label>
					<input
						id="endTime"
						type="time"
						bind:value={endTime}
						class="input"
						required
						disabled={loading}
					/>
				</div>
			</div>
		</div>

		<div class="card">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Staffing Requirements</h2>

			<div class="space-y-4">
				<div>
					<label for="requiredStaff" class="label">
						<Users class="w-4 h-4 inline mr-2" />
						Number of Staff Required
					</label>
					<input
						id="requiredStaff"
						type="number"
						bind:value={requiredStaff}
						class="input"
						min="1"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="skills" class="label">
						<Tag class="w-4 h-4 inline mr-2" />
						Required Skills (Optional)
					</label>
					<input
						id="skills"
						type="text"
						bind:value={skillsInput}
						class="input"
						placeholder="e.g., Customer Service, Forklift, First Aid (comma-separated)"
						disabled={loading}
					/>
					<p class="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
					{#if skills.length > 0}
						<div class="flex flex-wrap gap-2 mt-2">
							{#each skills as skill}
								<span class="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">
									{skill}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex gap-3">
			<button type="submit" class="btn-primary flex-1" disabled={loading}>
				{loading ? 'Creating Job...' : 'Create Job'}
			</button>
			<a href="/manager/jobs" class="btn-secondary">
				Cancel
			</a>
		</div>
	</form>
</div>
