import { addNewEndpoint, updateEndpoint, getEndpointInfo } from '../data/postgresserver.js';
import { addRequestEntry, getRequestEntriesByEndpointId } from '../data/mongoservice.js';

// use cases
// make new potatoBin
// retrieve all requests for potatoBin

async function addRequest(requestInfo) {
  const binToUpdate = await updateEndpoint(requestInfo.endpointId);

  if (binToUpdate.binNotFound) {
    return binToUpdate;
  }

  const addEntryResponse = await addRequestEntry(requestInfo);

  if (addEntryResponse.addRequestEntryFailed) {
    return { addRequestFailed: true };
  } else {
    return addEntryResponse;
  }
}

async function createBin() {
  let newBinPath;

  try {
    newBinPath = await addNewEndpoint();
  } catch (err) {
    console.log('error creating bin: ', err);
    return { createBinFailed: true };
  }

  return newBinPath;
}

async function getBinRequests(binPath) {
  const requests = await getRequestEntriesByEndpointId(binPath);

  if (requests.getRequestEntriesByEndpointIdFailed) {
    return { getRequestsFailed: true }
  } else {
    return requests;
  }
}

async function getEndpointDetails(binPath) {
  const endpointDetails = await getEndpointInfo(binPath);

  if (endpointDetails.binNotFound) {
    return { binNotFound: true }
  } else {
    return endpointDetails;
  }
}

export default { addRequest, createBin, getBinRequests, getEndpointDetails };
