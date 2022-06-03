// require('dotenv').config();
// console.log(require('dotenv').config({ path: '../../.env' }));
// const findConfig = require('find-config');
// const dotenvPath = findConfig('.env');
// require('dotenv').config({ path: dotenvPath });

import { MongoClient, ServerApiVersion } from 'mongodb';

// configuration info goes here

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@potatobin.z4lmi4p.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function addRequestEntry({ requestMethod, requestIp, headers, payload, endpointID }) {
  let newRequestEntry;

  try {
    await client.connect();

    const db = client.db(`${MONGODB_DB_NAME}`);
    const requestEntries = db.collection(`${MONGODB_COLLECTION_NAME}`);

    newRequestEntry = await requestEntries.insertOne({
      requestMethod,
      requestIp,
      headers,
      payload,
      endpointID,
    });

  } catch (error) {
    console.log('error adding requestEntry!', error);
    throw error;
  } finally {
    await client.close();
    return newRequestEntry.insertedId.valueOf().toString();
  }
}

async function getRequestEntriesByEndpointID(id) {
  let matchingRequestEntries;

  try {
    await client.connect();

    const db = client.db(`${MONGODB_DB_NAME}`);
    const requestEntries = db.collection(`${MONGODB_COLLECTION_NAME}`);

    const matchingRequestEntriesCursor = await requestEntries.find({
      endpointID: id,
    });

    matchingRequestEntries = await matchingRequestEntriesCursor.toArray();
  } catch (error) {
    console.log('error getting requestEntriesById! ', error);
    throw error;
  } finally {
    await client.close();
    return matchingRequestEntries;
  }
}

export { addRequestEntry, getRequestEntriesByEndpointID };
