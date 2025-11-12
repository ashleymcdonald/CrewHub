<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { signIn } from '$lib/services/auth';
	import { userProfile } from '$lib/stores/auth';
	import { Mail, Lock, AlertCircle } from 'lucide-svelte';

	let email = '';
	let password = '';
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
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			await signIn(email, password);
			// Navigation will be handled by the userProfile subscription above
		} catch (err: any) {
			error = err.message || 'Failed to sign in';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In - CrewHub</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
	<div class="card max-w-md w-full">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
			<p class="text-gray-600">Sign in to your CrewHub account</p>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
				<AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
				<p class="text-red-800 text-sm">{error}</p>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
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
				/>
			</div>

			<button type="submit" class="btn-primary w-full" disabled={loading}>
				{loading ? 'Signing In...' : 'Sign In'}
			</button>
		</form>

		<div class="mt-6 text-center">
			<p class="text-gray-600 text-sm">
				Don't have an account?
				<a href="/auth/register" class="text-primary-600 font-medium hover:text-primary-700">
					Sign up
				</a>
			</p>
		</div>
	</div>
</div>
