class Parser {
    START_PATTERN = '=======';

    CODE_IDX = 0;
    EN_IDX = [1, 2];
    RU_IDX = [3, 4];
    IS_SPECIAL_IDX = 5
    STYLE_IDX = 6;
 
    async start(processor) {
        return await fetch("../scripts/keys.txt")
            .then( response => response.text())
            .then( text => this.parse(text) );
    }

    parse(text){
        let res = [];
        let group = [];
        for (let line of text.split('\n')){
            if (line.startsWith(this.START_PATTERN)){
                res.push(group);
                group = [];
                continue;
            }
            let props = line.split('\t');
            const styles = (props.length > this.STYLE_IDX) ? props[this.STYLE_IDX].split(',').filter(e => e !== '') : [];
            group.push({
                code: props[this.CODE_IDX],
                en: props.filter((e, idx) => this.EN_IDX.includes(idx)),
                ru: (e, idx) => this.RU_IDX.includes(idx),
                isSpecial: props[this.IS_SPECIAL_IDX] !== '0',
                styles: styles
                }
            );
        }
        res.push(group);
        return res;
    }
}

export default Parser;