import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,webm}'],
                maximumFileSizeToCacheInBytes: 50 * 1024 * 1024 // 50MB
            },
            manifest: {
                name: 'Own Karma',
                short_name: 'Own Karma',
                description: 'A journey of conscious living.',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    build: {
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'vendor-react';
                        }
                        if (id.includes('gsap')) {
                            return 'vendor-gsap';
                        }
                        if (id.includes('three')) {
                            return 'vendor-three';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
})
