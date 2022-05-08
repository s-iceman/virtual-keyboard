class Creator {
    keys = [];
    isEn = true;

    constructor(keysData, isEn){
        this.keys = keysData;
        this.isEn = isEn;
    }

    createHeader(parent){
        const header = this._create('div', ['header']);
        header.textContent = 'RSS Виртуальная клавиатура';
        parent.appendChild(header);
    }

    createMain(parent){
        const main = this._create('div', ['main-wrapper']);
        this.createTextfield(main);
        this.createAlert(main);
        this.createKeys(main);
        parent.appendChild(main);
    }

    createTextfield(parent){
        const elem = this._create('textarea', ['textfield']);
        parent.appendChild(elem);
    }

    createAlert(parent){
        const elem = this._create('div', ['langAlert']);
        const changeLangLable = this._create('span');
        changeLangLable.textContent = 'Смена языка: Ctrl+Alt';
        elem.appendChild(changeLangLable);

        const lang = this._create('span');
        const langLabel = this._create('span');
        langLabel.textContent = 'Текущий язык:';
        const langValue = this._create('span', ['lang']);
        langValue.textContent = (this.isEn) ? 'EN' : 'RU';
        lang.appendChild(langLabel);
        lang.appendChild(langValue);
        elem.appendChild(lang);
        parent.appendChild(elem);
    }

    createKeys(parent){
        const lang = (this.isEn) ? 'en' : 'ru';
        const keyboard = this._create('div', ['keyboard']);
        let rowId = 0;
        for (let r of this.keys){
            const row = this._create('div', ['row']);
            let columnId = 0;
            for (let k of r){
                const elem = this._create('span', k.styles.concat(['key']));
                elem.id = k.code;
                elem.setAttribute('special', k.isSpecial);
                elem.setAttribute('position', `${rowId}_${columnId}`);
                elem.innerHTML = k[lang][0];
                row.appendChild(elem);
                columnId++;
            }
            rowId++;
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
        if (styles !== undefined){
            elem.classList.add(...styles);
        }
        return elem;
    }
};

export default Creator;