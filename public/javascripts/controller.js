class Controller {
  #view
  #model

  async addEndpoint() {
    console.log("telling the model to create a new endpoint...");
    const endpoint = await this.#model.addEndpoint();
    // model.addEndpoint currently does not exist
    this.#view.onNewEndpointClick(endpoint);
  }

  addRequest(binId, requestBody, requestHeaders) {
    console.log("I got a post request!");
    // console.log("binId I got was", binId);
    // console.log("requestBody I got was", requestBody);
    // console.log("requestHeaders I got was", requestHeaders);
    this.#model.addNewRequest(binId, requestBody, requestHeaders);
    // we could tell view to add another request here
  }

  #bindIndexEvents() {
    if (document.getElementById('index')) {
      const newBinBtn = document.getElementById('newBinBtn');
      console.log(newBinBtn);
      newBinBtn.onclick = this.addEndpoint.bind(this);
    }
  }
  
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#bindIndexEvents();
  }
}

export default Controller;