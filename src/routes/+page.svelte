<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/auth';
	import { Calendar, Users, MapPin, Clock } from 'lucide-svelte';

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
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
	<div class="text-center text-white mb-12">
		<h1 class="text-5xl font-bold mb-4">CrewHub</h1>
		<p class="text-xl opacity-90">Staff Scheduling & Job Assignment Made Simple</p>
	</div>

	<div class="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
			<Calendar class="w-12 h-12 mb-4" />
			<h3 class="text-xl font-semibold mb-2">Smart Scheduling</h3>
			<p class="opacity-90">Manage your team's schedule with ease. Assign jobs, track availability, and avoid conflicts.</p>
		</div>

		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
			<Users class="w-12 h-12 mb-4" />
			<h3 class="text-xl font-semibold mb-2">Team Management</h3>
			<p class="opacity-90">Coordinate your distributed workforce. Assign staff based on skills and availability.</p>
		</div>

		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
			<MapPin class="w-12 h-12 mb-4" />
			<h3 class="text-xl font-semibold mb-2">Location Tracking</h3>
			<p class="opacity-90">View job locations on a map. Staff can easily navigate to their assignments.</p>
		</div>

		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
			<Clock class="w-12 h-12 mb-4" />
			<h3 class="text-xl font-semibold mb-2">Real-time Updates</h3>
			<p class="opacity-90">Stay informed with instant notifications. Track attendance and job completion.</p>
		</div>
	</div>

	<div class="flex gap-4">
		<a href="/auth/login" class="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
			Sign In
		</a>
		<a href="/auth/register" class="btn-secondary border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
			Get Started
		</a>
	</div>
</div>
