import { addNewEndpoint, updateEndpoint, getEndpointInfo } from '../data/postgresserver.js';
import { addRequestEntry, getRequestEntriesByEndpointId } from '../data/mongoservice.js';

// use cases
// post to a potatoBin
// make new potatoBin
// retrieve all requests for potatoBin

async function addRequest(requestInfo) {
  const binToUpdate = await updateEndpoint(requestInfo.endpointId);

  if (binToUpdate.binNotFound) {
    return binToUpdate;
  }

  const addEntryResponse = await addRequestEntry(requestInfo);

  if (addEntryResponse.addRequestEntryFailed) {
    return {addRequestFailed: true};
  } else {
    return addEntryResponse;
  }
}

async function createBin() {

}

async function getBinRequests(binPath) {

}

export { addRequest, createBin, getBinRequests };
