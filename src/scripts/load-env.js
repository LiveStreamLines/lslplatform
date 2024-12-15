const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envConfig = dotenv.config().parsed;

// Generate a TypeScript file for the environment variables
const environmentFileContent = `
export const environment = {
  production: false,
  apiUrl: '${envConfig.BACKEND_URL}'
};
`;

// Write to the Angular environment file
fs.writeFileSync('src/environments/environment.ts', environmentFileContent);
console.log('Environment file created successfully:', environmentFileContent);
