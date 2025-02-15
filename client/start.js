const detectPort = require('detect-port');
const { exec } = require('child_process');
const detect = detectPort.default || detectPort;

const DEFAULT_PORT = process.env.PORT || 3000;

detect(DEFAULT_PORT)
  .then((freePort) => {
    if (DEFAULT_PORT != freePort) {
      console.log(`Port ${DEFAULT_PORT} is occupied, using available port ${freePort}.`);
    }
    
    // Set the available port in the environment variables so that react-scripts picks it up
    process.env.PORT = freePort;
    
    // Execute the default start script
    const child = exec('react-scripts start', { env: process.env });
    
    // Pipe output to the console
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 