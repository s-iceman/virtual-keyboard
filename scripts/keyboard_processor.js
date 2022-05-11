import Creator from './creator.js';

const EXCLUDED_ANIM = ['CapsLock'];

class KeyboardProcessor {
  creator = undefined;

  keysData = [];

  keyboard = undefined;

  textfield = undefined;

  isCapsLockActive = false;

  isShiftActive = false;

  constructor(keysData) {
    this.keysData = keysData;
    this.creator = new Creator(keysData, KeyboardProcessor.isEnLang());
  }

  start() {
    const parent = document.querySelector('body');
    this.creator.createPage(parent);
    this.textfield = document.querySelector('.textfield');
    this.keyboard = document.querySelector('.keyboard');
    this.addListeners();
  }

  addListeners() {
    this.keyboard.addEventListener('click', (ev) => this.pressVirtualKey(ev));
    document.addEventListener('keydown', (ev) => this.pressKey(ev));
    document.addEventListener('keyup', (ev) => this.upKey(ev));
  }

  activateKey(target) {
    if (EXCLUDED_ANIM.includes(target.id)) {
      return;
    }
    target.classList.add('active');
    target.addEventListener('animationend', this.deactivateKey.bind(this));
  }

  deactivateKey(event) {
    event.target.classList.remove('active');
    event.target.removeEventListener('animationend', this.deactivateKey.bind(this));
  }

  pressVirtualKey(ev) {
    const targetKey = ev.target.closest('.key');
    if (!targetKey) {
      return;
    }
    this.processKey(ev, targetKey, true);
  }

  pressKey(ev) {
    ev.preventDefault();
    const targetKey = document.getElementById(ev.code);
    this.activateKey(targetKey);
    this.processKey(ev, targetKey);
  }

  processKey(ev, targetKey, isVirtual = false) {
    this.activateKey(targetKey);
    const pos = this.textfield.selectionStart;
    const keyId = targetKey.id;
    if (targetKey.getAttribute('special') === 'false') {
      this.addSymbol(targetKey.innerHTML, pos);
    } else if (keyId === 'Tab') {
      this.addSymbol('\t', pos);
    } else if (keyId === 'Enter') {
      this.addSymbol('\n', pos);
    } else if (keyId === 'Backspace') {
      this.removeSymbol(Math.max(0, pos - 1), pos);
    } else if (keyId === 'Delete') {
      this.removeSymbol(pos, pos + 1);
    } else if (keyId === 'CapsLock') {
      this.processCapsLock(targetKey);
    } else if (ev.altKey && ev.ctrlKey) {
      this.changeLang();
    } else if (KeyboardProcessor.isShift(keyId)) {
      this.processShift(targetKey, isVirtual);
    }
  }

  addSymbol(symbol, pos) {
    let { value } = this.textfield;
    value = value.substring(0, pos) + symbol + value.substring(pos);
    this.textfield.innerHTML = value;
    this.setCursor(pos + 1);
  }

  removeSymbol(pos1, pos2) {
    let text = this.textfield.value;
    text = text.slice(0, pos1) + text.slice(pos2);
    this.textfield.innerHTML = text;
    this.setCursor(pos1);
  }

  processCapsLock(targetKey) {
    this.isCapsLockActive = !this.isCapsLockActive;
    this.changeLayout();
    targetKey.classList.toggle('pressed');
  }

  processShift(targetKey, isVirtual) {
    if (isVirtual) {
      this.isShiftActive = !this.isShiftActive;
    } else {
      this.isShiftActive = true;
    }
    this.changeLayout();
    if (this.isShiftActive) {
      targetKey.classList.add('pressed');
    } else {
      targetKey.classList.remove('pressed');
    }
  }

  upKey(ev) {
    ev.preventDefault();
    const targetKey = document.getElementById(ev.code);
    if (KeyboardProcessor.isShift(targetKey.id)) {
      this.isShiftActive = false;
      this.changeLayout();
      targetKey.classList.remove('pressed');
    }
  }

  changeLang() {
    const isEn = !KeyboardProcessor.isEnLang();
    localStorage.setItem('isEn', isEn);
    this.changeLayout();

    const lang = document.querySelector('.lang');
    lang.textContent = (isEn) ? 'EN' : 'RU';
  }

  changeLayout() {
    const lang = (KeyboardProcessor.isEnLang()) ? 'en' : 'ru';
    const idx = this.getModeIdx();
    const keys = document.querySelectorAll('.key');
    keys.forEach((k) => {
      const key = k;
      const [r, c] = key.getAttribute('position').split('_');
      const keyObj = this.keysData[r][c];
      if (keyObj !== undefined) {
        key.innerHTML = keyObj[lang][idx];
      }
    });
  }

  getModeIdx() {
    if (this.isCapsLockActive && this.isShiftActive) {
      return 3;
    }
    if (this.isCapsLockActive) {
      return 1;
    }
    if (this.isShiftActive) {
      return 2;
    }
    return 0;
  }

  setCursor(pos) {
    this.textfield.selectionStart = pos;
    this.textfield.selectionEnd = pos;
    this.textfield.focus();
  }

  static isEnLang() {
    return JSON.parse(localStorage.getItem('isEn'));
  }

  static isShift(keyId) {
    return keyId && keyId.startsWith('Shift');
  }
}

export default KeyboardProcessor;
