console.log("contextual-alt.js loaded");

const icon = `<svg width="16" height="16" class="Draftail-Icon" aria-hidden="true" viewBox="0 0 576 512" fill="currentColor"><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"></path></svg>`;

const generateDescription = async (imageURL) => {
  const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
  const captioner = await pipeline('image-to-text', 'Mozilla/distilvit');
  const output = await captioner(imageURL);
  return output[0].generated_text;
}

class ContextualAltController extends window.StimulusModule.Controller {
  static values = {
    description: { default: "", type: String },
  };

  connect() {
    this.setupOutput();
  }

  setupOutput() {
    if (this.output) return;
    const template = document.createElement("template");
    template.innerHTML = `<output name='word-count' for='${this.element.id}' class='output-label'></output><button type="button" class="button button-secondary">${icon} Generate suggestions</button>`;
    const output = template.content.firstChild;
    const trigger = template.content.lastChild;
    this.element.insertAdjacentElement("afterend", output);
    this.element.insertAdjacentElement("afterend", trigger);
    this.output = output;
    this.trigger = trigger;
    this.triggerClick = this.summarize.bind(this);

    trigger.addEventListener("click", this.triggerClick);
  }

  async summarize(event) {
    this.output.textContent = "Generating…";
    // const pageContent = document.querySelector("#w-preview-iframe").contentDocument.querySelector("main")?.innerText || '';
    // const helpTextId = this.element.getAttribute("aria-describedby");
    // const label = document.querySelector(`label[for="${this.element.id}"]`).innerText;
    // const helpText = helpTextId ? document.querySelector(`#${helpTextId}`).innerText : '';
    // const context = `The page’s ${label}. ${helpText}; ${this.sharedContextValue}`;
    // let description = this.descriptionValue;

    // if (!description) {
    //   const url = document.getElementById("chooser-thumbnail").src;
    //   const description = await generateDescription(url);
    // }
    
    const output = await generateDescription(url);
    if (output) {
      this.element.value = output;
      this.output.textContent = '';
    } else {
      this.output.textContent = "No suggestion available";
    }
  }

  disconnect() {
    this.output && this.output.remove();
    this.trigger.removeEventListener("click", this.triggerClick);
    this.trigger && this.trigger.remove();
  }
}
window.wagtail.app.register("contextual-alt", ContextualAltController);
