import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
		}
	},
	server: {
		cors: {
			origin: '*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			preflightContinue: true,
			optionsSuccessStatus: 204
		},
		proxy: {
			'^/api/.*': {
				target: 'http://kjvonly-dev-server:5000',
				changeOrigin: true,
				proxyTimeout: 6000 * 60 * 1000
			}
		}
	}
});
