const express = require('express');
const cors = require('cors');

const configureRoutes = require('./config/routes');

const server = express();
const corsOptions = {
  // If you're moving onto the stretch problem you'll need to set this obj with the appropriate fields
  // ensure that your client's URL/Port can achieve a Handshake
  // then pass this object to the cors() function
};

server.use(express.json());
server.use(cors());

configureRoutes(server);

server.get('/', (req, res) =>{
  res.send('<h1>It works</h1>')
})

module.exports = {
  server,
};
