import KeyboardProcessor from './keyboard_processor.js';
import Parser from './parser.js';

class Controller {
  parser = undefined;

  keyboardCtrl = undefined;

  constructor() {
    this.parser = new Parser();
  }

  async start() {
    await this.parser.start().then((response) => {
      this.keyboardCtrl = new KeyboardProcessor(response);
      this.keyboardCtrl.start();
    });
  }
}

const ctrl = new Controller();

ctrl.start();
