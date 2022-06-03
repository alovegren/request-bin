import View from "./view.js";
import Model from "./model.js";
import Controller from "./controller.js";

class App {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller(this.model, this.view);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});