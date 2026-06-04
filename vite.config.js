import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    // Substitui pelo nome exato do teu repositório no GitHub entre barras
    base: '/330-final-project/',
});