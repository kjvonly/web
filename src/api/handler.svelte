<script lang="ts" context="module">
import { goto } from '$app/navigation';

export class UserService {
	
	async greet(greetRequest: any) {
		const headers = {
			'Accept':		'application/json',
			'Accept-Encoding':	'gzip',
			'Content-Type':		'application/json',
		}
		greetRequest = greetRequest || {}
		const response = await fetch('/api/unauthz', {
			method: 'GET',
			headers: headers,
//			body: JSON.stringify(greetRequest)
		})

		
		return response.json().then((json) => {
			if (json.Error === "Unauthorized") {
				goto("/read")
			}
			if (json.error) {
				throw new Error(json.error)
			}
			return json
		})
	}
	
}
</script>