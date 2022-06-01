import View from "./view.js";

let App = {
  init() {
    this.view = new View()
    return this;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = Object.create(App)
  app.init();
})