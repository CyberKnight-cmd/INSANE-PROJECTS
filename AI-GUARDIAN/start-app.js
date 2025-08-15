import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the paths
const rootDir = __dirname;
const apiDir = path.join(rootDir, 'src', 'api');

// Function to start a process
function startProcess(command, args, cwd, name) {
  console.log(`Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe'
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`[${name} ERROR] ${data}`);
  });

  process.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });

  return process;
}

// Start the backend API server
const apiServer = startProcess('npm', ['run', 'start'], apiDir, 'Backend API');

// Wait for the API server to start before starting the frontend
setTimeout(() => {
  // Start the frontend development server
  const frontendServer = startProcess('npm', ['run', 'dev'], rootDir, 'Frontend');

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down servers...');
    apiServer.kill();
    frontendServer.kill();
    process.exit(0);
  });
}, 3000); // Wait 3 seconds for the API server to start

console.log('AI Guardian servers starting. Press Ctrl+C to stop.');