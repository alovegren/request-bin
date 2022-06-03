import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dbService from './data/services/dbService.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('port', 3000);
app.use('/', express.static(path.join(__dirname, 'public')));
const publicPath = path.join(__dirname, 'public/html')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// apis
app.get('/api/endpoints/:endpoint_id/requests', (req, res) => {
  try {
    const requests = await dbService.getRequestEntriesByEndpointID(endpoint_id);
    res.status(200).send(requests);
  } catch (error) {
    res.status(503).json({ error });
  }
});

app.post('/api/endpoints', (req, res) => {
  try {
    const endpointId = await dbService.createEndpoint();
    res.status(201).json({ endpointId });
  } catch (error) {
    res.status(503).json({ error });
  }
});

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(publicPath + '/index.html');
});

//Route for specific endpoint
app.get('/:endpoint', (req, res) => {
  res.sendFile(publicPath + '/endpoint.html');
});

// POST requests sent to endpoint
app.post('/:bin_id', async (req, res) => {
  const endpointID = req.params.bin_id;

  const requestDocumentId = await addRequestEntry({
    requestMethod: req.method,
    requestIp: req.ip,
    headers: req.headers,
    payload: req.body,
    endpointID, 
  });

  console.log(`request document with an id of ${requestDocumentId} has been added`);

  res.status(200).send('Request received');
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

export default app;