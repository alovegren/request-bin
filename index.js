const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('port', 3000);
app.use('/', express.static(path.join(__dirname, 'public')));
const publicPath = path.join(__dirname, 'public/html')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(publicPath + '/index.html')
});

//Route for specific endpoint
app.get('/:endpoint', (req, res) => {
  res.sendFile(publicPath + '/endpoint.html')
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

module.exports = app;