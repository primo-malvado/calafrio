import getStateList from './getStateList';

export function grammarMixer (lexerList) {
    const structure = {
        endMap: {},
        end: [],
        start: [],
        table: []

    };

    let lastId = 0;

    function getNextId () {
        const n = lastId++;
        return `${n}`;
    }

    const map = {};

    for (let l = 0; l < lexerList.length; l++) {
        const lexema = lexerList[l];
        lexema.priority = l;
        map[lexema.tokenType] = {};


        const stateList = getStateList(lexema.sm.table);

        stateList.forEach(stateId => map[lexema.tokenType][stateId] = getNextId());

        lexema.sm.table.forEach((jump) => {
            structure.table.push({
                from: map[lexema.tokenType][jump.from],
                to: map[lexema.tokenType][jump.to],
                _ft_: jump._ft_,
                _tt_: jump._tt_
            });
        });

        lexema.sm.start.forEach((stateId) => {
            structure.start.push(
                map[lexema.tokenType][stateId],
            );
        });

        lexema.sm.end.forEach((stateId) => {
            const endStateId = map[lexema.tokenType][stateId];

            structure.end.push(endStateId);

            if (structure.endMap[endStateId] === undefined) {
                structure.endMap[endStateId] = {

                    tokenType: lexema.tokenType,
                    parseFunction: lexema.parseFunction,
                    priority: lexema.priority
                };
            } else if (structure.endMap[endStateId].priority > lexema.priority) {
                structure.endMap[endStateId] = {

                    tokenType: lexema.tokenType,
                    parseFunction: lexema.parseFunction,
                    priority: lexema.priority
                };
            }
        });
    }

    return structure;
}
