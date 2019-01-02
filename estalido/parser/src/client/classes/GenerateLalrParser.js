
let Actions = {
    'shift': 0,
    'reduce': 1,
    'accept': 2,
    'goto': 2
};


export function createParser (parserRules) {
    let create;
    let ruleIdx;
    let rule;
    let ruleLen;
    let dotPos;
    let changed;
    let term;
    let lastLen;
    const goal = parserRules.start;

    Array.prototype.unique = function () {
        const unique = [];
        for (let i = 0; i < this.length; i++) {
            if (unique.indexOf(this[i]) == -1) {
                unique.push(this[i]);
            }
        }
        return unique;
    };

    Array.prototype.contains = function (values) {
        let i = this.length;
        while (i--) {
            if (values.indexOf(this[i]) !== -1) {
                return true;
            }
        }
        return false;
    };


    const precedence = {};

    for (let i = 0; i < parserRules.precedence.length; i++) {
        for (let j = 0; j < parserRules.precedence[i].tokens.length; j++) {
            precedence[parserRules.precedence[i].tokens[j]] = {
                type: parserRules.precedence[i].type,
                level: i + 1
            };
        }
    }

    const firstMap = {};

    for (create in parserRules.states) {
        firstMap[create] = {

            firsts: [],
            follows: [],
            hasEmptyRules: false,
            isTerminal: false
        };

        for (ruleIdx = 0; ruleIdx < parserRules.states[create].rules.length; ruleIdx++) {
            rule = parserRules.states[create].rules[ruleIdx].rule;
            ruleLen = rule.length;
            if (ruleLen === 0) {
                firstMap[create].hasEmptyRules = true;
            }

            for (dotPos = 0; dotPos < ruleLen; dotPos++) {
                term = rule[dotPos];
                if (firstMap[term] === undefined) {
                    firstMap[term] = {

                        isTerminal: true,
                        follows: [],
                        firsts: [term]
                    };
                }
            }
        }
    }

    changed = true;

    while (changed) {
        changed = false;

        for (create in parserRules.states) {
            lastLen = firstMap[create].firsts.length;

            if (firstMap[create].isTerminal === false) {
                for (ruleIdx = 0; ruleIdx < parserRules.states[create].rules.length; ruleIdx++) {
                    rule = parserRules.states[create].rules[ruleIdx].rule;
                    ruleLen = rule.length;
                    if (ruleLen > 0) {
                        for (dotPos = 0; dotPos < ruleLen; dotPos++) {
                            term = rule[dotPos];
                            firstMap[create].firsts = firstMap[create].firsts.concat(firstMap[term].firsts);

                            if (firstMap[term].isTerminal || firstMap[term].hasEmptyRules === false) {
                                break;
                            }
                        }
                    }
                }

                firstMap[create].firsts = firstMap[create].firsts.unique();
            }

            if (lastLen !== firstMap[create].firsts.length) {
                changed = true;
            }
        }
    }

    firstMap[goal].follows.push('eof');

    changed = true;

    while (changed) {
        changed = false;

        for (create in parserRules.states) {
            if (firstMap[create].isTerminal === false) {
                for (ruleIdx = 0; ruleIdx < parserRules.states[create].rules.length; ruleIdx++) {
                    rule = parserRules.states[create].rules[ruleIdx].rule;
                    ruleLen = rule.length;
                    if (ruleLen > 0) {
                        for (dotPos = ruleLen - 1; dotPos > 0; dotPos--) {
                            for (let dotPosPrev = dotPos - 1; dotPosPrev >= 0; dotPosPrev--) {
                                term = rule[dotPos];
                                const termPrev = rule[dotPosPrev];

                                lastLen = firstMap[termPrev].follows.length;
                                firstMap[termPrev].follows = firstMap[termPrev].follows.concat(firstMap[term].firsts);
                                firstMap[termPrev].follows = firstMap[termPrev].follows.unique();

                                if (lastLen !== firstMap[termPrev].follows.length) {
                                    changed = true;
                                }

                                if (firstMap[termPrev].isTerminal || firstMap[termPrev].hasEmptyRules === false) {
                                    break;
                                }
                            }
                        }
                        const lastTerm = rule[ruleLen - 1];

                        lastLen = firstMap[lastTerm].follows.length;

                        firstMap[lastTerm].follows = firstMap[lastTerm].follows.concat(firstMap[create].follows);
                        firstMap[lastTerm].follows = firstMap[lastTerm].follows.unique();

                        if (lastLen !== firstMap[lastTerm].follows.length) {
                            changed = true;
                        }
                    }
                }
            }
        }
    }

    function getEmptyJumpsDest (stateArray) {
        const listaDeCoisas = stateArray.map(id => list.filter(item => item.state.create == list[id].state.base[list[id].pos] && item.pos === 0));

        const xxx = listaDeCoisas.map(a => a.map(b => b.id));

        const flattened = stateArray.concat(xxx.reduce((a, b) => a.concat(b), []))
            .unique()
            .sort((a, b) => a - b);

        if (flattened.length != stateArray.length) {
            return getEmptyJumpsDest(flattened);
        }
        return flattened;
    }

    const table = {};

    let list = [];
    let lastId = 0;
    let id = 0;
    let stateId = 0;

    const stateList = {};

    const monitor = {};
    const newIdToNfa = {};

    for (create in parserRules.states) {
        parserRules.states[create].hasEmptyRules = false;
        parserRules.states[create].isTerminal = false;

        for (ruleIdx = 0; ruleIdx < parserRules.states[create].rules.length; ruleIdx++) {
            const _stateId = stateId++;

            const state = {
                id: _stateId,
                create,
                base: parserRules.states[create].rules[ruleIdx].rule,
                action: parserRules.states[create].rules[ruleIdx].action,
                precedence: null
            };

            stateList[_stateId] = state;

            if (state.base.length === 0) {
                parserRules.states[create].hasEmptyRules = true;
            }

            let lexeme;
            ruleLen = parserRules.states[create].rules[ruleIdx].rule.length;
            for (dotPos = 0; dotPos < ruleLen + 1; dotPos++) {
                const _id = id++;

                lexeme = parserRules.states[create].rules[ruleIdx].rule[dotPos];
                if (precedence[lexeme] !== undefined) {
                    state.precedence = precedence[lexeme];
                }

                list.push({
                    state,
                    id: _id,
                    pos: dotPos,
                    reduce: dotPos === ruleLen,
                    listFinalStates: []

                });
            }

            if (parserRules.states[create].rules[ruleIdx].prec) {
                lexeme = parserRules.states[create].rules[ruleIdx].prec;
                state.precedence = precedence[lexeme];
            }
        }
    }

    for (let i = 0; i < list.length; i++) {
        list[i].emptyJumps = getEmptyJumpsDest([list[i].id]);
    }

    const origens = list[0].emptyJumps;

    parseTree(origens);

    function getSimpleEmptyJumpsDest (stateArrayParam) {
        let simple = [];

        stateArrayParam.map(id => list[id].emptyJumps)
            .forEach((l) => {
                simple = simple.concat(l);
            });

        return simple.unique()
            .sort((a, b) => a - b);
    }

    function addToMonitor (stateArray) {
        const _idsDestino = stateArray;

        const stateArrayKey = _idsDestino.join('-');

        if (monitor[stateArrayKey] === undefined) {
            const xxID = lastId++;

            stateArray.forEach((i) => {
                list[i].listFinalStates.push(xxID);
            });

            monitor[stateArrayKey] = {

                id: xxID,
                ids: stateArray,
                processed: false
            };

            newIdToNfa[xxID] = stateArray;
        }

        return {
            id: monitor[stateArrayKey].id,
            key: stateArrayKey
        };
    }

    function parseTree (origens) {
        const origensStatesId = addToMonitor(origens);

        if (monitor[origensStatesId.key].processed === false) {
            monitor[origensStatesId.key].processed = true;

            const theState = {

            };

            const tokens = origens
                .map(id => list[id].state.base[list[id].pos])
                .filter(item => item !== undefined)
                .unique();

            for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
                const token = tokens[tokenIdx];

                let dest = [];

                origens.map((origensId) => {
                    const origem = list[origensId];

                    const p = list.filter(st => st.state.id === origem.state.id && st.pos === origem.pos + 1 &&
                            st.state.base[st.pos - 1] === token)
                        .map(s => s.id);

                    dest = dest.concat(p);
                });

                const idsDestino = getSimpleEmptyJumpsDest(dest);

                const destinoStatesId = addToMonitor(idsDestino);

                if (theState.next === undefined) {
                    theState.next = {};
                }

                theState.next[token] = destinoStatesId.id;

                parseTree(idsDestino);
            }

            table[origensStatesId.id] = theState;
        }
    }

    const terminals = Object.keys(firstMap)
        .filter(item => firstMap[item].isTerminal);
    terminals.unshift('eof');

    const nonTerminals = Object.keys(firstMap)
        .filter(item => firstMap[item].isTerminal === false);

    const result = {};

    for (stateId in table) {
        result[stateId] = {};

        const reduceList = {};

        newIdToNfa[stateId]
            .filter(stateId => list[stateId].reduce)

            .forEach((stateId) => {
                const state = list[stateId].state;

                firstMap[state.create].follows.forEach((follow) => {
                    if (reduceList[follow] === undefined) {
                        reduceList[follow] = [];
                    }

                    reduceList[follow].push(stateId);
                });
            });

        for (let terminalIdx = 0; terminalIdx < terminals.length; terminalIdx++) {
            let _list = [];
            const token = terminals[terminalIdx];

            if (table[stateId].next && table[stateId].next[token]) {
                const tokenPrec = precedence[token];
                const obj = {
                    action: Actions.shift,
                    stateId,
                    to: table[stateId].next[token],
                    prec: {
                        type: tokenPrec ? tokenPrec.type : 'none',
                        level: tokenPrec ? tokenPrec.level : -1
                    }

                };

                _list.push(obj);
            }

            if (reduceList[token] !== undefined) {
                const stateIds = reduceList[token];

                const xxx = stateIds.map((stateId) => {
                    const state = list[stateId].state;
                    const obj = {
                        stateId: state.id,
                        action: state.create === goal ? Actions.accept : Actions.reduce,
                        to: `${state.create}:= ${state.base.join(' ')}`,
                        prec: {
                            type: state.precedence ? state.precedence.type : 'none',
                            level: state.precedence ? state.precedence.level : -1
                        }

                    };
                    return obj;
                });

                _list = _list.concat(xxx);
            }

            _list.sort((a, b) => {
                let diff = b.prec.level - a.prec.level;

                if (diff === 0) {
                    diff = a.stateId - b.stateId;
                }

                return diff;
            });

            if (_list.length === 1) {
                result[stateId][token] = [
                    _list[0].action,
                    _list[0].action === Actions.shift ? _list[0].to : _list[0].stateId // list[stateId].state
                ];

                continue;
            }

            if (_list.length > 1) {
                if (

                    (_list[0].prec.type === 'left' && _list[1].prec.type === 'left') ||
                    (_list[0].prec.type === 'none' && _list[1].prec.type === 'none') ||
                    (_list[0].prec.type !== _list[1].prec.type)

                ) {
                    result[stateId][token] = [
                        _list[0].action,
                        _list[0].action === Actions.shift ? _list[0].to : _list[0].stateId // list[stateId].state
                    ];

                    continue;
                }
            }

            if (_list.length > 0) {
                throw 'conflito';
            }
        }

        for (let nonTerminalIdx = 0; nonTerminalIdx < nonTerminals.length; nonTerminalIdx++) {
            if (table[stateId].next && table[stateId].next[nonTerminals[nonTerminalIdx]]) {
                const _token = nonTerminals[nonTerminalIdx];

                const _goto = table[stateId].next[nonTerminals[nonTerminalIdx]];
                result[stateId][_token] = [
                    Actions.goto,
                    _goto
                ];

            }
        }
    }

    const states = Object.keys(stateList)
        .map((stateId) => {
            const state = stateList[stateId];

            return {
                create: state.create,
                base: state.base,
                action: state.action // .toString()

            };
        });

    return {
        tokens: Object.keys(firstMap),
        states,
        ignoreTokens: parserRules.ignoreTokens,
        table: result
    };
}
