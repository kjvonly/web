import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	server: {
		cors: {
			"origin": "*",
			"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
			"preflightContinue": true,
			"optionsSuccessStatus": 204
		},
		proxy: {
			"/api": {
				target: 'http://localhost:5000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	}
});
