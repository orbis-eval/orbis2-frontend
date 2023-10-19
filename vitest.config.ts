import path from 'path'
import vue from '@vitejs/plugin-vue';

export default {
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov']
        }
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './'),
        }
    }
};