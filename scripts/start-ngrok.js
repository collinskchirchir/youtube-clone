#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';
const port = process.argv[2] || '3000';
const domain = process.argv[3];

let command, args, options;

if (isWindows) {
  command = 'ngrok';
  args = ['http'];
  if (domain) {
    args.push('--domain', domain);
  }
  args.push(port);
  options = { stdio: 'inherit', shell: true };
} else {
  command = 'ngrok';
  args = ['http'];
  if (domain) {
    args.push('--domain', domain);
  }
  args.push(port);
  options = { stdio: 'inherit' };
}

console.log(`Starting ngrok on port ${port}...`);
console.log(`Command: ${command} ${args.join(' ')}`);

const ngrok = spawn(command, args, options);

ngrok.on('error', (error) => {
  console.error('Failed to start ngrok:', error.message);
  process.exit(1);
});

ngrok.on('close', (code) => {
  console.log(`ngrok exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down ngrok...');
  ngrok.kill('SIGINT');
});