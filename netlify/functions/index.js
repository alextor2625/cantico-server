const express = require('express');
const app = require('./src/bin/www');

const server = express();

// Use the existing Express app
server.use(app);

// Export the server as the handler
module.exports = server;