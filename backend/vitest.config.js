import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,       // Para usar describe, it, expect sin importar
        environment: 'node', // Para simular un entorno de servidor Node.js
    },
});