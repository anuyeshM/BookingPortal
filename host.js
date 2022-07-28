const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const options = {
  key: fs.readFileSync('C:/GIT/SSL/service-portaldev.com/server.key'),
  cert: fs.readFileSync('C:/GIT/SSL/service-portaldev.com/f93e03c712ec9a25.crt'),
  ca: [fs.readFileSync('C:/GIT/SSL/service-portaldev.com/gd_bundle-g2-g1.crt')],
};

https.createServer(options, app).listen(7979);
