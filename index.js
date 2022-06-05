import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// import dbService from './data/services/dbService.js';
import { addRequestEntry, getRequestEntriesByEndpointId } from './public/data/mongoservice.js';
import { addNewEndpoint, updateEndpoint } from './public/data/postgresserver.js';

const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.set('port', 3001);
// app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// apis
// app.get('/api/endpoints/:endpoint_id', async (req, res) => {
//   try {
//     // const details = await dbService.getEndpointDetails(
//     //   req.params.endpoint_id
//     // );

//     const details = await

//     res.status(200).send(details);
//   } catch (error) {
//     res.status(404).json({ error });
//   }
// });

app.get('/api/endpoints/:endpoint_id/requests', async (req, res) => {
  try {
    // const requests = await dbService.getRequestEntriesByEndpointID(
    //   req.params.endpoint_id
    // );

    const requests = await getRequestEntriesByEndpointId(
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
    // const endpointId = await dbService.createEndpoint();
    const endpointId = await addNewEndpoint();
    res.status(201).json({ endpointId });
  } catch (error) {
    res.status(503).json({ error });
  }
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