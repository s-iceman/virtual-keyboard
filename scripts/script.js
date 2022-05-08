import Parser from "./parser.js";
import Creator from "./creator.js";

const EXCLUDED_ANIM = ['CapsLock'];


class Keyboard {
    creator = undefined;
    keysData = [];

    keyboard = undefined;
    textfield = undefined;

    isCapsLockActive = false;

    constructor(keysData){
        this.keysData = keysData;
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
        document.addEventListener('keyup', (ev) => this.upKey(ev));
    }

    activateKey(target){
        if (EXCLUDED_ANIM.includes(target.id)){
            return;
        }
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
        this.processKey(ev, targetKey);
    }

    pressKey(ev){
        ev.preventDefault();
        //console.log(ev);
        const targetKey = document.getElementById(ev.code);
        this.activateKey(targetKey);
        this.processKey(ev, targetKey);
    }

    upKey(ev){
        console.log('UP - capslock');
    }

    processKey(ev, targetKey){
        this.activateKey(targetKey);
        const pos = this.textfield.selectionStart;
        const keyId = targetKey.id;
        if (targetKey.getAttribute('special') === 'false'){
            this.addSymbol(targetKey.innerHTML, pos);
        }
        else if (keyId === 'Tab'){
            this.addSymbol('\t', pos);
        }
        else if (keyId === 'Enter'){
            this.addSymbol('\n', pos);
        }
        else if (keyId === 'Backspace'){
            this.removeSymbol(Math.max(0, pos - 1), pos);
        }
        else if (keyId === 'Delete'){
            this.removeSymbol(pos, pos + 1);
        }
        else if (keyId === 'CapsLock'){
            this.processCapsLock(targetKey);
        }
        else if (keyId.startWith('Shift')){
            this.processShift();
        }
        else if (ev.altKey && ev.ctrlKey){
            this.changeLang();
        }
    }

    addSymbol(symbol, pos){
        let value = this.textfield.value;
        value = value.substring(0, pos) + symbol + value.substring(pos);
        this.textfield.innerHTML = value;
        this.setCursor(pos + 1);
    }

    removeSymbol(pos1, pos2){
        let text = this.textfield.value;
        text = text.slice(0, pos1) + text.slice(pos2);
        this.textfield.innerHTML = text;
        this.setCursor(pos1);
    }

    processCapsLock(targetKey){
        this.isCapsLockActive = !this.isCapsLockActive;
        const idx = (this.isCapsLockActive) ? 1 : 0;
        const keys = document.querySelectorAll('.key');
        keys.forEach(k => {
            const [r, c] = k.getAttribute('position').split('_');
            const keyObj = this.keysData[r][c];
            if (keyObj !== undefined){
                k.innerHTML = keyObj.en[idx];
            }
        })
        targetKey.classList.toggle('pressed');
    }

    processShift(){
        console.log('SHIFT');
    }

    changeLang(){
        console.log('CHANGE LANG');
    }

    setCursor(pos){
        this.textfield.selectionStart = this.textfield.selectionEnd = pos;
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
