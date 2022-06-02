class Controller {
  async addEndpoint() {
    const endpoint = await this.model.addEndpoint();
    this.view.onNewEndpointClick(endpoint);
  }

  #bindEvents() {
    const newBinBtn = document.getElementById('newBinBtn');
    newBinBtn.onclick = this.addEndpoint.bind(this);
  }
  
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.#bindEvents();
  }
}

export default Controller;