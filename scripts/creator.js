class Creator {
  keys = [];

  isEn = true;

  constructor(keysData, isEn) {
    this.keys = keysData;
    this.isEn = isEn;
  }

  static createHeader(parent) {
    const header = Creator.create('div', ['header']);
    header.textContent = 'RSS Виртуальная клавиатура';
    parent.appendChild(header);
  }

  createMain(parent) {
    const main = Creator.create('div', ['main-wrapper']);
    Creator.createTextfield(main);
    this.createAlert(main);
    this.createKeys(main);
    parent.appendChild(main);
  }

  static createTextfield(parent) {
    const elem = Creator.create('textarea', ['textfield']);
    parent.appendChild(elem);
  }

  createAlert(parent) {
    const elem = Creator.create('div', ['langAlert']);
    const changeLangLable = Creator.create('span');
    changeLangLable.textContent = 'Linux. Смена языка: Ctrl+Alt';
    elem.appendChild(changeLangLable);

    const lang = Creator.create('span');
    const langLabel = Creator.create('span');
    langLabel.textContent = 'Текущий язык:';
    const langValue = Creator.create('span', ['lang']);
    langValue.textContent = (this.isEn) ? 'EN' : 'RU';
    lang.appendChild(langLabel);
    lang.appendChild(langValue);
    elem.appendChild(lang);
    parent.appendChild(elem);
  }

  createKeys(parent) {
    const lang = (this.isEn) ? 'en' : 'ru';
    const keyboard = Creator.create('div', ['keyboard']);
    let rowId = 0;
    this.keys.forEach((r) => {
      const row = Creator.create('div', ['row']);
      let columnId = 0;
      r.forEach((k) => {
        const elem = Creator.create('span', k.styles.concat(['key']));
        elem.id = k.code;
        elem.setAttribute('special', k.isSpecial);
        elem.setAttribute('position', `${rowId}_${columnId}`);
        const value = k[lang][0];
        elem.innerHTML = value;
        row.appendChild(elem);
        columnId += 1;
      });
      rowId += 1;
      keyboard.appendChild(row);
    });
    parent.appendChild(keyboard);
  }

  createPage(parent) {
    const wrapper = Creator.create('div', ['wrapper']);
    Creator.createHeader(wrapper);
    this.createMain(wrapper);
    parent.insertBefore(wrapper, parent.firstChild);
  }

  static create(tag, styles) {
    const elem = document.createElement(tag);
    if (styles !== undefined) {
      elem.classList.add(...styles);
    }
    return elem;
  }
}

export default Creator;
