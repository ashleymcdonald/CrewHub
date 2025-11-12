<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { user, userProfile } from '$lib/stores/auth';
	import { onAuthStateChanged } from 'firebase/auth';
	import { getUserProfile } from '$lib/services/user';

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				user.set(firebaseUser);
				const profile = await getUserProfile(firebaseUser.uid);
				userProfile.set(profile);
			} else {
				user.set(null);
				userProfile.set(null);
			}
		});

		return () => unsubscribe();
	});
</script>

<slot />
