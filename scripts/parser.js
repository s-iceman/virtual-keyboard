class Parser {
    START_PATTERN = '=======';

    EN_IDX = [0, 1];
    RU_IDX = [2, 3];
    STYLE_IDX = 4;
 
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
                en: props.filter((e, idx) => this.EN_IDX.includes(idx)),
                ru: (e, idx) => this.RU_IDX.includes(idx),
                styles: styles
                }
            );
        }
        res.push(group);
        return res;
    }
}

export default Parser;