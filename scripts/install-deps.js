#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Installing Groq SDK...');
try {
  execSync('pnpm add @groq/sdk', { stdio: 'inherit' });
  console.log('Successfully installed @groq/sdk');
} catch (error) {
  console.error('Failed to install @groq/sdk:', error.message);
  process.exit(1);
}
