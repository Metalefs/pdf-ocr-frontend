import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import path from 'path';
const __dirname = path.dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        restoreMocks: true,
        clearMocks: true,
    },
    server: {
        port: 54336,
    },
    resolve: {
        alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@config': path.resolve(__dirname, './src/config'),
        '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
})