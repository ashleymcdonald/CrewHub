<script lang="ts">
	import { onMount } from 'svelte';
	import { userProfile } from '$lib/stores/auth';
	import { updateUserProfile } from '$lib/services/user';
	import { User, Mail, Phone, Tag, Save, AlertCircle, CheckCircle } from 'lucide-svelte';
	import type { User as UserType } from '$lib/types';

	let profile: UserType | null = null;
	let name = '';
	let phone = '';
	let skillsInput = '';
	let loading = true;
	let saving = false;
	let success = false;
	let error = '';

	onMount(() => {
		const unsubscribe = userProfile.subscribe((p) => {
			if (p) {
				profile = p;
				name = p.name;
				phone = p.phone || '';
				skillsInput = p.skills.join(', ');
				loading = false;
			}
		});

		return () => unsubscribe();
	});

	$: skills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

	async function handleSubmit() {
		if (!profile) return;

		if (!name) {
			error = 'Name is required';
			return;
		}

		saving = true;
		error = '';
		success = false;

		try {
			await updateUserProfile(profile.uid, {
				name,
				phone,
				skills
			});

			userProfile.update(p => p ? { ...p, name, phone, skills } : null);
			success = true;
			setTimeout(() => success = false, 3000);
		} catch (err: any) {
			error = err.message || 'Failed to update profile';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Profile - CrewHub Staff</title>
</svelte:head>

<div class="max-w-3xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
		<p class="text-gray-600 mt-1">Manage your personal information and skills</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
		</div>
	{:else}
		{#if success}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
				<CheckCircle class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
				<p class="text-green-800 text-sm">Profile updated successfully!</p>
			</div>
		{/if}

		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
				<AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
				<p class="text-red-800 text-sm">{error}</p>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<!-- Basic Information -->
			<div class="card">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

				<div class="space-y-4">
					<div>
						<label for="name" class="label">
							<User class="w-4 h-4 inline mr-2" />
							Full Name
						</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							class="input"
							placeholder="John Doe"
							required
							disabled={saving}
						/>
					</div>

					<div>
						<label for="email" class="label">
							<Mail class="w-4 h-4 inline mr-2" />
							Email Address
						</label>
						<input
							id="email"
							type="email"
							value={profile?.email}
							class="input bg-gray-100"
							disabled
						/>
						<p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
					</div>

					<div>
						<label for="phone" class="label">
							<Phone class="w-4 h-4 inline mr-2" />
							Phone Number
						</label>
						<input
							id="phone"
							type="tel"
							bind:value={phone}
							class="input"
							placeholder="+1 (555) 000-0000"
							disabled={saving}
						/>
					</div>
				</div>
			</div>

			<!-- Skills -->
			<div class="card">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Skills & Certifications</h2>

				<div>
					<label for="skills" class="label">
						<Tag class="w-4 h-4 inline mr-2" />
						Your Skills
					</label>
					<input
						id="skills"
						type="text"
						bind:value={skillsInput}
						class="input"
						placeholder="e.g., Customer Service, Forklift, First Aid (comma-separated)"
						disabled={saving}
					/>
					<p class="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>

					{#if skills.length > 0}
						<div class="mt-4">
							<p class="text-sm font-medium text-gray-700 mb-2">Current Skills:</p>
							<div class="flex flex-wrap gap-2">
								{#each skills as skill}
									<span class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-medium text-sm">
										{skill}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Account Info -->
			<div class="card bg-gray-50">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>

				<div class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-600">Account Type:</span>
						<span class="font-medium text-gray-900 capitalize">{profile?.role}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Member Since:</span>
						<span class="font-medium text-gray-900">
							{profile?.createdAt ? new Date(profile.createdAt.toDate()).toLocaleDateString() : 'N/A'}
						</span>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button type="submit" class="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
					<Save class="w-4 h-4" />
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	{/if}
</div>
