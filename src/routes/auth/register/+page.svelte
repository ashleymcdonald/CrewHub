<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { signUp } from '$lib/services/auth';
	import { userProfile } from '$lib/stores/auth';
	import { Mail, Lock, User, Phone, Briefcase, AlertCircle } from 'lucide-svelte';
	import type { UserRole } from '$lib/types';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let name = '';
	let phone = '';
	let role: UserRole = 'staff';
	let error = '';
	let loading = false;

	onMount(() => {
		const unsubscribe = userProfile.subscribe((profile) => {
			if (profile) {
				if (profile.role === 'manager') {
					goto('/manager/dashboard');
				} else {
					goto('/staff/dashboard');
				}
			}
		});

		return () => unsubscribe();
	});

	async function handleSubmit() {
		if (!email || !password || !name) {
			error = 'Please fill in all required fields';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;
		error = '';

		try {
			await signUp({ email, password, name, phone, role });
			// Navigation will be handled by the userProfile subscription above
		} catch (err: any) {
			error = err.message || 'Failed to create account';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up - CrewHub</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4 py-12">
	<div class="card max-w-md w-full">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
			<p class="text-gray-600">Create your CrewHub account</p>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
				<AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
				<p class="text-red-800 text-sm">{error}</p>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-5">
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
					disabled={loading}
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
					bind:value={email}
					class="input"
					placeholder="you@example.com"
					required
					disabled={loading}
				/>
			</div>

			<div>
				<label for="phone" class="label">
					<Phone class="w-4 h-4 inline mr-2" />
					Phone Number (Optional)
				</label>
				<input
					id="phone"
					type="tel"
					bind:value={phone}
					class="input"
					placeholder="+1 (555) 000-0000"
					disabled={loading}
				/>
			</div>

			<div>
				<label for="role" class="label">
					<Briefcase class="w-4 h-4 inline mr-2" />
					Account Type
				</label>
				<select id="role" bind:value={role} class="input" required disabled={loading}>
					<option value="staff">Staff Member</option>
					<option value="manager">Manager</option>
				</select>
			</div>

			<div>
				<label for="password" class="label">
					<Lock class="w-4 h-4 inline mr-2" />
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="input"
					placeholder="••••••••"
					required
					disabled={loading}
					minlength="6"
				/>
			</div>

			<div>
				<label for="confirmPassword" class="label">
					<Lock class="w-4 h-4 inline mr-2" />
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					class="input"
					placeholder="••••••••"
					required
					disabled={loading}
					minlength="6"
				/>
			</div>

			<button type="submit" class="btn-primary w-full" disabled={loading}>
				{loading ? 'Creating Account...' : 'Create Account'}
			</button>
		</form>

		<div class="mt-6 text-center">
			<p class="text-gray-600 text-sm">
				Already have an account?
				<a href="/auth/login" class="text-primary-600 font-medium hover:text-primary-700">
					Sign in
				</a>
			</p>
		</div>
	</div>
</div>
