import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { addRequestEntry } from './public/data/mongoservice.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
});

// POST requests sent to endpoint
app.post('/:bin_id', async (req, res) => {
  const endpointID = req.params.bin_id;

  const mongoId = await addRequestEntry({
    requestMethod: req.method,
    requestIp: req.ip,
    headers: req.headers,
    payload: req.body,
    endpointID, 
  });

  res.send(`${mongoId}`);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

export default app;