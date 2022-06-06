import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@potatobin.z4lmi4p.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function addRequestEntry({ requestMethod, requestIp, headers, payload, endpointId }) {
  let newRequestEntry;

  try {
    await client.connect();

    const db = client.db(`${process.env.MONGODB_DB_NAME}`);
    const requestEntries = db.collection(`${process.env.MONGODB_COLLECTION_NAME}`);

    newRequestEntry = await requestEntries.insertOne({
      requestMethod,
      requestIp,
      headers,
      payload,
      endpointId,
    });

  } catch (error) {
    console.log('error adding requestEntry!', error);
    return {addRequestEntryFailed: true};
  } finally {
    await client.close();
    return newRequestEntry.insertedId.valueOf().toString();
  }
}

async function getRequestEntriesByEndpointId(id) {
  let matchingRequestEntries;

  try {
    await client.connect();

    const db = client.db(`${process.env.MONGODB_DB_NAME}`);
    const requestEntries = db.collection(`${process.env.MONGODB_COLLECTION_NAME}`);

    const matchingRequestEntriesCursor = await requestEntries.find({
      endpointId: id,
    });

    // execution does not make it to this line

    matchingRequestEntries = await matchingRequestEntriesCursor.toArray();
  } catch (error) {
    console.log('error getting requestEntriesById! ', error);
    return { getRequestEntriesByEndpointIdFailed: true};
  } finally {
    await client.close();
    return matchingRequestEntries;
  }
}

export { addRequestEntry, getRequestEntriesByEndpointId };
