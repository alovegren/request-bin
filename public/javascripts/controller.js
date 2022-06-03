class Controller {
  #view
  #model

  async addEndpoint() {
    console.log("telling the model to create a new endpoint...");
    const endpoint = await this.#model.addEndpoint();
    // model.addEndpoint currently does not exist
    this.#view.onNewEndpointClick(endpoint);
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