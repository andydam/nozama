const express = require('express');

const router = require('./server/routes');

const server = express();
const PORT = process.env.PORT || 3000;

server.use(router);
server.listen(PORT, () => console.log(`nozama is listening on port ${PORT}`));

module.exports = server;
