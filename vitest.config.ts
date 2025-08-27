import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Enable TypeScript support
    globals: true,
    environment: 'node',

    // Test file patterns
    include: ['**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist'],

    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/index.ts' // Exclude main entry file from coverage
      ]
    }
  }
})
