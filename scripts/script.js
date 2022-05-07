import Parser from "./parser.js";

class Creator {
    keys = [];

    constructor(keysData){
        this.keys = keysData;
    }

    createHeader(parent){
        const header = this._create('div', ['header']);
        header.textContent = 'RSS Виртуальная клавиатура';
        parent.appendChild(header);
    }

    createMain(parent){
        const main = this._create('div', ['main-wrapper']);
        this.createTextfield(main);
        this.createKeys(main);
        parent.appendChild(main);
    }

    createTextfield(parent){
        const elem = this._create('textarea', ['textfield']);
        parent.appendChild(elem);
    }

    createKeys(parent){
        const keyboard = this._create('div', ['keyboard']);
        for (let r of this.keys){
            const row = this._create('div', ['row']);
            for (let k of r){
                const e = this._create('span', k.styles.concat(['key']));
                e.innerHTML = k.en[0];
                row.appendChild(e);
            }
            keyboard.appendChild(row);
        }
        parent.appendChild(keyboard);
    }

    createPage(parent){
        const wrapper = this._create('div', ['wrapper']);
        this.createHeader(wrapper);
        this.createMain(wrapper);
        parent.insertBefore(wrapper, parent.firstChild);
    }

    _create(tag, styles){
        const elem = document.createElement(tag);
        elem.classList.add(...styles);
        return elem;
    }
};


class Keyboard {
    creator = undefined;

    keyboard = undefined;
    textfield = undefined;

    constructor(keysData){
        this.creator = new Creator(keysData);
    }

    start(){
        const parent = document.querySelector('body');
        this.creator.createPage(parent);
        this.textfield = document.querySelector('.textfield');
        this.keyboard = document.querySelector('.keyboard');
        this.addListeners();
    }

    addListeners(){
        this.keyboard.addEventListener('click', (ev) => this.pressKey(ev));
    }

    pressKey(ev){
        if (!ev.target.closest('.key')){
            return;
        }
    }
}


class Controller {
    parser = undefined;
    keyboardCtrl = undefined;

    constructor(){
        this.parser = new Parser();
    }

    async start(){
        await this.parser.start().then((response) => {
            this.keyboardCtrl = new Keyboard(response);
            this.keyboardCtrl.start();
        });
    }
}

const ctrl = new Controller();
ctrl.start();
