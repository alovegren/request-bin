// require('dotenv').config();
// console.log(require('dotenv').config({ path: '../../.env' }));
// const findConfig = require('find-config');
// const dotenvPath = findConfig('.env');
// require('dotenv').config({ path: dotenvPath });

import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_USER = 'potatobinJJAM_user';
const MONGODB_PASSWORD = 'm7r9aZitZYnM80vV';
const MONGODB_DB_NAME = 'potatoBin';
const MONGODB_COLLECTION_NAME = 'requestEntries';

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@potatobin.z4lmi4p.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function addRequestEntry({ requestMethod, requestIp, headers, payload, endpointURL }) {
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
      endpointURL,
    });

  } catch (error) {
    console.log('oh no, error bro!', error);
  } finally {
    await client.close();
    return newRequestEntry.insertedId.valueOf().toString();
  }
}

const headers = [
  'x-github-header-1: scooby-doo',
  'x-github-header-2: where are you?',
  'x-github-header-3: kermit the frog',
  'x-github-header-4: miss piggy',
  'x-github-header-5: gonzo the weirdo',
  'x-github-header-6: sam the eagle',
  'x-github-header-7: swedish chef',
  'x-github-header-8: fozzie bear',
];

const payload = 'This will in theory be a ton of individual text bloopity blabbity boop-bop';

const endpointURL = 'scoobityJJAM';

const addRequestEntryArgs = {headers, payload, endpointURL};

// (async () => console.log(await addRequestEntry(addRequestEntryArgs)))();

export { addRequestEntry };
