import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, configDefaults } from 'vitest/config';
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
				target: 'http://kjvonly-nginx:5000',
				changeOrigin: true,
				proxyTimeout: 6000 * 60 * 1000
			},
			'^/v1/.*': {
				target: 'http://kjvonly-nginx:8080',
				changeOrigin: true,
				proxyTimeout: 6000 * 60 * 1000
			}
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: [...configDefaults.exclude],
		deps: {
			optimizer: {
				ssr: {
					exclude: ['"@tinymce/tinymce-svelte']
				}
			}
		}
	}
});
