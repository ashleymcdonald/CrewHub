<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/auth';
	import { signOut } from '$lib/services/auth';
	import { Calendar, User, LogOut, Menu, X } from 'lucide-svelte';

	let profile: any = null;
	let showMobileMenu = false;

	onMount(() => {
		const unsubscribe = userProfile.subscribe((p) => {
			profile = p;
			if (p && p.role !== 'staff') {
				goto('/manager/dashboard');
			} else if (!p) {
				goto('/auth/login');
			}
		});

		return () => unsubscribe();
	});

	async function handleSignOut() {
		await signOut();
		goto('/auth/login');
	}

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}

	$: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Mobile Header -->
	<div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
		<h1 class="text-xl font-bold text-primary-600">CrewHub</h1>
		<button on:click={toggleMobileMenu} class="p-2 text-gray-600 hover:text-gray-900">
			{#if showMobileMenu}
				<X class="w-6 h-6" />
			{:else}
				<Menu class="w-6 h-6" />
			{/if}
		</button>
	</div>

	<div class="flex">
		<!-- Sidebar -->
		<aside class="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen">
			<div class="p-6 border-b border-gray-200">
				<h1 class="text-2xl font-bold text-primary-600">CrewHub</h1>
				<p class="text-sm text-gray-600 mt-1">Staff Portal</p>
			</div>

			<nav class="flex-1 p-4 space-y-2">
				<a
					href="/staff/dashboard"
					class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === '/staff/dashboard'
						? 'bg-primary-50 text-primary-700'
						: 'text-gray-700 hover:bg-gray-100'}"
				>
					<Calendar class="w-5 h-5" />
					<span class="font-medium">My Schedule</span>
				</a>

				<a
					href="/staff/profile"
					class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === '/staff/profile'
						? 'bg-primary-50 text-primary-700'
						: 'text-gray-700 hover:bg-gray-100'}"
				>
					<User class="w-5 h-5" />
					<span class="font-medium">Profile</span>
				</a>
			</nav>

			<div class="p-4 border-t border-gray-200">
				<div class="px-4 py-3 mb-2">
					<p class="text-sm font-medium text-gray-900">{profile?.name || 'Staff'}</p>
					<p class="text-xs text-gray-600">{profile?.email || ''}</p>
				</div>
				<button
					on:click={handleSignOut}
					class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
				>
					<LogOut class="w-5 h-5" />
					<span class="font-medium">Sign Out</span>
				</button>
			</div>
		</aside>

		<!-- Mobile Menu -->
		{#if showMobileMenu}
			<div class="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" on:click={toggleMobileMenu}>
				<aside class="bg-white w-64 h-full" on:click|stopPropagation>
					<div class="p-6 border-b border-gray-200">
						<h1 class="text-2xl font-bold text-primary-600">CrewHub</h1>
						<p class="text-sm text-gray-600 mt-1">Staff Portal</p>
					</div>

					<nav class="p-4 space-y-2">
						<a
							href="/staff/dashboard"
							on:click={toggleMobileMenu}
							class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === '/staff/dashboard'
								? 'bg-primary-50 text-primary-700'
								: 'text-gray-700 hover:bg-gray-100'}"
						>
							<Calendar class="w-5 h-5" />
							<span class="font-medium">My Schedule</span>
						</a>

						<a
							href="/staff/profile"
							on:click={toggleMobileMenu}
							class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {currentPath === '/staff/profile'
								? 'bg-primary-50 text-primary-700'
								: 'text-gray-700 hover:bg-gray-100'}"
						>
							<User class="w-5 h-5" />
							<span class="font-medium">Profile</span>
						</a>
					</nav>

					<div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
						<div class="px-4 py-3 mb-2">
							<p class="text-sm font-medium text-gray-900">{profile?.name || 'Staff'}</p>
							<p class="text-xs text-gray-600">{profile?.email || ''}</p>
						</div>
						<button
							on:click={handleSignOut}
							class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
						>
							<LogOut class="w-5 h-5" />
							<span class="font-medium">Sign Out</span>
						</button>
					</div>
				</aside>
			</div>
		{/if}

		<!-- Main Content -->
		<main class="flex-1 p-4 lg:p-8">
			<slot />
		</main>
	</div>
</div>
