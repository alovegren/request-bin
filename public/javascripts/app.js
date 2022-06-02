import View from "./view.js";
import Model from "./model.js";
import Controller from "./controller.js";

let App = {
  init() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller(this.model, this.view);
    return this;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = Object.create(App)
  app.init();
})