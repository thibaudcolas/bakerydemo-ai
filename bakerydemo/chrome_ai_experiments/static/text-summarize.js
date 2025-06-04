const summarizeText = async (text, options) => {
  console.log(options)
  const availability = await Summarizer.availability();
  let summarizer;
  if (availability === "unavailable") {
    return;
  }
  console.log({ availability });
  if (availability === "available") {
    summarizer = await Summarizer.create(options);
  } else {
    // The Summarizer API can be used after the model is downloaded.
    summarizer = await Summarizer.create(options);
    summarizer.addEventListener("downloadprogress", (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
    await summarizer.ready;
  }
  const summary = await summarizer.summarize(text);
  console.log("Summary:", summary);

  return summary;
};

class TextSummarizeController extends window.StimulusModule.Controller {
  static values = {
    type: { default: "", type: String },
    length: { default: "", type: String },
    format: { default: "plain-text", type: String },
    sharedContext: { default: "", type: String },
  };

  connect() {
    this.setupOutput();
  }

  setupOutput() {
    if (this.output) return;
    const template = document.createElement("template");
    template.innerHTML = `<output name='word-count' for='${this.element.id}' class='output-label'></output><button type="button">Generate</button>`;
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
    if (!window.Summarizer) {
      this.output.textContent = "Summarization unavailable (enable the experimental API in Chrome 138, chrome://flags/#summarization-api-for-gemini-nano)";
    }
    const availability = await Summarizer.availability();
    if (availability === "unavailable") {
      this.output.textContent = "Summarization unavailable";
      return;
    }
    this.output.textContent = "Summarizing…";

    const pageContent = document.querySelector("#w-preview-iframe").contentDocument.querySelector("main").innerText;
    const helpTextId = this.element.getAttribute("aria-describedby");
    const label = document.querySelector(`label[for="${this.element.id}"]`).innerText;
    const helpText = helpTextId ? document.querySelector(`#${helpTextId}`).innerText : '';
    const context = `The page’s ${label}. ${helpText}; ${this.sharedContextValue}`;
    const summary = await summarizeText(pageContent, {
      sharedContext: context,
      type: this.typeValue,
      length: this.lengthValue,
      format: this.formatValue,
    });
    if (summary) {
      this.element.value = summary;
      this.output.textContent = '';
    } else {
      this.output.textContent = "No summary available";
    }
  }

  disconnect() {
    this.output && this.output.remove();
    this.trigger.removeEventListener("click", this.triggerClick);
    this.trigger && this.trigger.remove();
  }
}
window.wagtail.app.register("text-summarize", TextSummarizeController);
