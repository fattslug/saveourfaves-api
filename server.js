require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');
const chalk = require('chalk');
const fs = require('fs');

const db = require('./src/db');
const app = express();

app.use(passport.initialize());

// CORS Setup
if (process.env.USE_CORS === 'true') {
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  const corsOptions = {
    origin: '',
    optionsSuccessStatus: 200
  }

  app.use((req, res, next) => {
    if (allowedOrigins.indexOf(req.headers.origin) > -1) {
      corsOptions.origin = req.headers.origin;
      next();
    } else {
      console.log(chalk.red('Access from invalid origin: '), req.headers.origin);
      res.sendStatus(403);
    }
  });
  app.use(cors(corsOptions));
}

// Body Parser
app.use(bodyParser.json({
  limit: process.env.JSON_SIZE_LIMIT
}));
app.use(bodyParser.urlencoded({
  limit: process.env.JSON_SIZE_LIMIT,
  extended: true
}));

// Routes
const entryRoutes = require('./src/routes/entry.routes');
app.use('/entries', entryRoutes);

// Listen
let server;
if (process.env.USE_HTTPS == 'true') {
  server = https.createServer({
    key: fs.readFileSync('./sof/saveourfaves.to.key'),
    cert: fs.readFileSync('./sof/saveourfaves_to.crt'),
    ca: [fs.readFileSync('./sof/ca-1.crt'), fs.readFileSync('./sof/ca-2.crt'), fs.readFileSync('./sof/ca-3.crt')]
  }, app);
} else {
  server = http.createServer(app);
}
server.listen(port);
server.on('listening', () => {
  console.log(chalk.black.bgGreen(`==> Listening on port ${port}...`))
});