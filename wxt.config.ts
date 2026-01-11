import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    manifest: {
        name: 'Focus - Website Blocker',
        description: 'Block distracting websites with keyword-based filtering to stay focused and productive',
        permissions: ['storage'],
    },
});
