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
                const elem = this._create('span', k.styles.concat(['key']));
                elem.id = k.code;
                elem.setAttribute('special', k.isSpecial);
                elem.innerHTML = k.en[0];
                row.appendChild(elem);
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
        this.keyboard.addEventListener('click', (ev) => this.pressVirtualKey(ev));
        document.addEventListener('keydown', (ev) => this.pressKey(ev));
    }

    activateKey(target){
        target.classList.add('active');
        target.addEventListener('animationend', this.deactivateKey.bind(this) );
    }

    deactivateKey(event){
        const target = event.target;
        target.classList.remove('active');
        target.removeEventListener('animationend', this.deactivateKey.bind(this) );
    }

    pressVirtualKey(ev){
        const targetKey = ev.target.closest('.key');
        if (!targetKey){
            return;
        }
        this._processKey(ev, targetKey);
    }

    pressKey(ev){
        ev.preventDefault();
        const targetKey = document.getElementById(ev.code);
        this.activateKey(targetKey);
        this._processKey(ev, targetKey);
    }

    _processKey(ev, targetKey){
        this.activateKey(targetKey);
        if (targetKey.getAttribute('special') === 'false'){
            const value = targetKey.innerHTML;
            this.textfield.value += value;
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
