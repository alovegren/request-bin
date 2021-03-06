class View {
  constructor() {
    this.#createTemplates();
    this.#createNav();
  }

  onNewEndpointClick(endpointObj) {
    const template = templates.endpointTemplate(endpointObj);
    document.body.insertAdjacentHTML('beforeend', template);
  }

  #createTemplates() {
    this.templates = {};

    let temps = [...document.querySelectorAll('script[type="text/x-handlebars"]')];
    temps.forEach(temp => {
      this.templates[temp.id] = Handlebars.compile(temp.innerHTML);
    });
  }

  #createNav() {
    let addHtml = this.templates.navTemplate()
    document.body.insertAdjacentHTML('afterbegin', addHtml)
    var els = document.querySelectorAll('.speak');
    [].forEach.call(els, function(el) {
      el.addEventListener('click', function() {
        [].forEach.call(els, function(clk) {
          clk.classList.remove('active');
        });
        el.classList.add('active');
      });
    });
  }
}

export default View;