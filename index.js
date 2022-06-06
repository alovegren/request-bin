import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dbService from './public/services/dbService.js';

const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.set('port', 3008);
// app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// apis
app.get('/api/endpoints/:endpoint_id', async (req, res) => {
  try {
    const details = await dbService.getEndpointDetails(
      req.params.endpoint_id
    );

    res.status(200).send(details);
  } catch (error) {
    res.status(404).json({ error });
  }
});

app.get('/api/endpoints/:endpoint_id/requests', async (req, res) => {
  try {
    const requests = await dbService.getBinRequests(
      req.params.endpoint_id
    );

    res.status(200).send(requests);
  } catch (error) {
    res.status(404).json({ error });
  }
});

// POST requests for new endpoints
app.post('/api/endpoints', async (req, res) => {
  try {
    const endpointId = await dbService.createBin();
    res.status(201).json({ endpointId });
  } catch (error) {
    res.status(503).json({ error });
  }
});

// POST requests sent to endpoint
app.post('/:bin_id', async (req, res) => {
  const endpointId = req.params.bin_id;

  const addedRequest = await addRequest({
    requestMethod: req.method,
    requestIp: req.ip,
    headers: req.headers,
    payload: req.body,
    endpointId,
  });

  if (addedRequest.binNotFound) {
    res.sendStatus(404);
  } else if (addedRequest.addRequestFailed) {
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

export default app;
