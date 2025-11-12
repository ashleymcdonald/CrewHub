<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllUsers } from '$lib/services/user';
	import { Users, Mail, Phone, Briefcase, Tag } from 'lucide-svelte';
	import type { User } from '$lib/types';

	let allUsers: User[] = [];
	let loading = true;

	onMount(async () => {
		try {
			allUsers = await getAllUsers();
		} catch (error) {
			console.error('Error loading users:', error);
		} finally {
			loading = false;
		}
	});

	$: staffUsers = allUsers.filter(u => u.role === 'staff');
	$: managerUsers = allUsers.filter(u => u.role === 'manager');
</script>

<svelte:head>
	<title>Staff - CrewHub Manager</title>
</svelte:head>

<div>
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Staff Management</h1>
		<p class="text-gray-600 mt-1">View and manage your team members</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
		</div>
	{:else}
		<!-- Stats -->
		<div class="grid sm:grid-cols-3 gap-6 mb-8">
			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Staff</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{staffUsers.length}</p>
					</div>
					<div class="bg-primary-100 p-3 rounded-full">
						<Users class="w-6 h-6 text-primary-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Managers</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{managerUsers.length}</p>
					</div>
					<div class="bg-purple-100 p-3 rounded-full">
						<Briefcase class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>

			<div class="card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Users</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{allUsers.length}</p>
					</div>
					<div class="bg-green-100 p-3 rounded-full">
						<Users class="w-6 h-6 text-green-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Staff List -->
		<div class="card">
			<h2 class="text-xl font-bold text-gray-900 mb-6">Staff Members</h2>

			{#if staffUsers.length === 0}
				<div class="text-center py-12">
					<Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600">No staff members found</p>
				</div>
			{:else}
				<div class="grid gap-4">
					{#each staffUsers as staff}
						<div class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div class="flex-1">
									<h3 class="font-semibold text-gray-900 text-lg mb-2">{staff.name}</h3>
									<div class="space-y-1">
										<div class="flex items-center gap-2 text-sm text-gray-600">
											<Mail class="w-4 h-4" />
											{staff.email}
										</div>
										{#if staff.phone}
											<div class="flex items-center gap-2 text-sm text-gray-600">
												<Phone class="w-4 h-4" />
												{staff.phone}
											</div>
										{/if}
									</div>

									{#if staff.skills.length > 0}
										<div class="mt-3">
											<p class="text-xs text-gray-600 mb-2 flex items-center gap-1">
												<Tag class="w-3 h-3" />
												Skills
											</p>
											<div class="flex flex-wrap gap-2">
												{#each staff.skills as skill}
													<span class="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">
														{skill}
													</span>
												{/each}
											</div>
										</div>
									{/if}
								</div>

								<div>
									<span class="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
										{staff.role}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Managers List -->
		{#if managerUsers.length > 0}
			<div class="card mt-6">
				<h2 class="text-xl font-bold text-gray-900 mb-6">Managers</h2>

				<div class="grid gap-4">
					{#each managerUsers as manager}
						<div class="p-4 border border-gray-200 rounded-lg">
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<h3 class="font-semibold text-gray-900 text-lg mb-2">{manager.name}</h3>
									<div class="space-y-1">
										<div class="flex items-center gap-2 text-sm text-gray-600">
											<Mail class="w-4 h-4" />
											{manager.email}
										</div>
										{#if manager.phone}
											<div class="flex items-center gap-2 text-sm text-gray-600">
												<Phone class="w-4 h-4" />
												{manager.phone}
											</div>
										{/if}
									</div>
								</div>

								<div>
									<span class="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
										{manager.role}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
