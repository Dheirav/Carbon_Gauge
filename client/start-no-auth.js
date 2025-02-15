const detectPort = require('detect-port');
const { exec } = require('child_process');
const detect = detectPort.default || detectPort;

const DEFAULT_PORT = process.env.PORT || 3000;

// Read the desired role from the command line.
// For example: "node start-no-auth.js industrial" makes the app run as an industrial user.
// If not provided, it defaults to "regular".
const userRole = process.argv[2] || 'regular';

// Set environment variables to bypass authentication and specify the demo role.
// These will be available as process.env.REACT_APP_BYPASS_AUTH and process.env.REACT_APP_USER_ROLE
process.env.REACT_APP_BYPASS_AUTH = 'true';
process.env.REACT_APP_USER_ROLE = userRole;

detect(DEFAULT_PORT)
  .then((freePort) => {
    if (DEFAULT_PORT != freePort) {
      console.log(`Port ${DEFAULT_PORT} is occupied, using available port ${freePort}.`);
    }
    
    // Set the available port so that react-scripts picks it up
    process.env.PORT = freePort;
    
    // Execute the default start script
    const child = exec('react-scripts start', { env: process.env });
    
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  }); 