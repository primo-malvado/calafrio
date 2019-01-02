/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getStateList;
function getStateList(table) {

    const fromList = table.map(item => item.from);
    const toList = table.map(item => item.to);

    return [...new Set([...fromList, ...toList])];
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = expandTable;
Array.prototype.unique = function () {
    const unique = [];
    for (let i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};

function expandTable(table) {
    const froms = table.map(item => item._ft_.charCodeAt(0));

    const tos = table.map(item => item._tt_.charCodeAt(0) + 1);

    const breaks = froms.concat(tos).unique().sort();

    const newTable = [];

    table.forEach(item => {
        let f = item._ft_.charCodeAt(0);
        const t = item._tt_.charCodeAt(0);

        let changed = false;
        breaks.forEach(_break => {
            changed = false;
            if (_break > f && _break <= t) {
                const _new = {
                    _ft_: String.fromCharCode(f),
                    _tt_: String.fromCharCode(_break - 1),
                    from: item.from,
                    to: item.to
                };
                newTable.push(_new);

                f = _break;
                changed = true;
            }
        });

        if (!changed) {
            newTable.push({
                _ft_: String.fromCharCode(f),
                _tt_: String.fromCharCode(t),
                from: item.from,
                to: item.to
            });
        }
    });

    return newTable;
}
;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

let Actions = {
    'shift': 0,
    'reduce': 1,
    'accept': 2,
    'goto': 2
};

class Parser {

    constructor(lexer, config) {
        this.lexer = lexer;
        this.table = config.table;
        this.ignoreTokens = config.ignoreTokens || [];
        this.states = config.states;
    }

    0 /* shift*/(stateId) {
        const next = this.lexer.popToken();
        // console.log(next);
        this.stack.unshift(next);

        this._actualState = stateId;
    }

    1 /* reduce*/(stateId) {
        this._reduce(stateId);
        this._actualState = this.actualState();
    }

    2 /* accept*/(stateId) {
        this._reduce(stateId);
    }

    _reduce(stateId) {
        const reducer = this.states[stateId];

        const baseLen = reducer.base.length;
        const tree = [];
        for (let i = 0; i < baseLen; i++) {
            const a = this.stack.shift();
            tree.unshift(a);
        }
        if (reducer.action === undefined) {
            reducer.action = function (args) {
                return '---';
            };
        }
        const value = reducer.action(tree);

        this.stack.unshift({
            tokenType: reducer.create,
            tree,
            rules: value
        });
    }

    actualState() {
        let actualState = 0;

        for (let pos = this.stack.length - 1; pos > -1; pos--) {

            actualState = this.table[actualState][this.stack[pos].tokenType][1];
        }
        return actualState;
    }
    parse(text) {

        this.lexer.setInput(text);

        this.stack = [];

        this._actualState = this.actualState();

        while (true) {
            const token = this.lexer.readToken();

            if (this.ignoreTokens.indexOf(token.tokenType) !== -1) {
                this.lexer.popToken();
                continue;
            }

            if (this.table[this._actualState][token.tokenType]) {
                const nextAction = this.table[this._actualState][token.tokenType];
                // console.log(nextAction.t, nextAction[1])


                if (typeof this[nextAction[0]] !== 'function') {
                    debugger;
                }

                this[nextAction[0]](nextAction[1]);

                if (nextAction[0] === Actions.accept) {
                    break;
                }
            } else {

                console.log(`%c${this.lexer.input.substring(this.lexer.nextToken.startPosition - 10, this.lexer.nextToken.startPosition)}%c${this.lexer.input.substring(this.lexer.nextToken.startPosition, this.lexer.nextToken.toPos)}%c${this.lexer.input.substring(this.lexer.nextToken.toPos, this.lexer.YYCURSOR + 10)}`, 'background:#fff;color:#000', 'background:#f00;color:#fff', 'background:#fff;color:#000');

                throw 'unexpeted ';
            }
        }
    }

}

/* harmony default export */ __webpack_exports__["a"] = (Parser);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Lexer {
    constructor(grammar) {
        this.states = ['INITIAL'];
        this.YYCURSOR = 0;
        this.grammar = grammar;
        this.nextToken = null;
    }

    setInput(exp) {
        this.input = exp;
        this.states = ['INITIAL'];
        this.YYCURSOR = 0;
        this.nextToken = null;
    }

    readToken() {
        if (this.nextToken === null) {
            this.nextToken = this.parse();
        }

        return this.nextToken;
    }

    beginState(state) {
        this.states.unshift(state);
    }

    parse() {
        const startPosition = this.YYCURSOR;

        this.yytext = '';
        let stateId = '0';

        let buffer = null;

        this.YYLIMIT = this.input.length;

        while (this.YYCURSOR < this.YYLIMIT) {
            const current_read = this.input.charAt(this.YYCURSOR);

            const states = this.grammar[this.states[0]].table.filter(jump => jump.from === stateId && jump._ft_ <= current_read && jump._tt_ >= current_read);

            if (states.length > 0) {
                this.YYCURSOR++;
                this.yytext += current_read;
                stateId = states[0].to;

                if (this.grammar[this.states[0]].endMap[stateId] !== undefined) {
                    const tokenType = this.grammar[this.states[0]].endMap[stateId].tokenType;

                    buffer = {
                        tokenType,
                        parseFunction: this.grammar[this.states[0]].endMap[stateId].parseFunction,
                        content: this.yytext,
                        startPosition,
                        pos: this.YYCURSOR
                    };
                }
            } else if (buffer !== null) {
                if (buffer.parseFunction) {
                    const t = buffer.parseFunction(this);
                    t.startPosition = startPosition;
                    t.toPos = buffer.pos;

                    return t;
                }
                return buffer;
            } else {
                console.log(`%c${this.input.substring(startPosition - 10, startPosition)}%c${this.input.substring(startPosition, this.YYCURSOR + 1)}%c${this.input.substring(this.YYCURSOR + 1, this.YYCURSOR + 10)}`, 'background:#fff;color:#000', 'background:#f00;color:#fff', 'background:#fff;color:#000');

                throw 'lexer unexpeted ';
            }
        }

        if (buffer !== null) {
            if (buffer.parseFunction) {
                const tx = buffer.parseFunction(this);
                tx.startPosition = startPosition;
                tx.toPos = buffer.pos;

                return tx;
            }
            return buffer;
        }

        return {
            tokenType: 'eof'
        };
    }

    popToken() {
        const token = this.readToken();
        this.nextToken = null;
        return token;
    }

}

/* harmony default export */ __webpack_exports__["a"] = (Lexer);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = determinize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__expandTable__ = __webpack_require__(1);




function intersection(x, y) {
    x.sort();y.sort();
    let i = 0;
    let j = 0;
    const ret = [];
    while (i < x.length && j < y.length) {
        if (x[i] < y[j]) {
            i++;
        } else if (y[j] < x[i]) {
            j++;
        } else {
            ret.push(x[i]);
            i++, j++;
        }
    }
    return ret;
}

let lastId = 0;
function getNextId() {
    const n = lastId++;
    return `${n}`;
}

function getReachableStates(table, states) {
    const lista = table.filter(item => {
        if (item.token) {
            return states.indexOf(item.from) !== -1 && item.token === 'ε';
        }

        return states.indexOf(item.from) !== -1 && item._ft_ === 'ε' && item._tt_ === 'ε';
    }).map(item => item.to);

    const newList = [...new Set([...lista, ...states])];
    if (states.length === newList.length) {
        return newList;
    }
    return getReachableStates(table, newList);
}

function getReachableStatesWithToken(config, states, _ft_, _tt_) {
    const lista = config.table.filter(item => {
        if (item.token) {
            return states.indexOf(item.from) !== -1 && item.token == _ft_;
        }

        return states.indexOf(item.from) !== -1 && item._ft_ <= _ft_ && item._tt_ >= _tt_;
    }).map(item => item.to);

    return getReachableStates(config.table, lista);
}

function determinize(structure) {
    lastId = 0;
    const monitor = {
        idMap: {},
        processed: {}
    };

    const configOriginal = {
        table: Object(__WEBPACK_IMPORTED_MODULE_0__expandTable__["a" /* default */])(structure.table),
        start: structure.start,
        endMap: structure.endMap,
        end: structure.end
    };

    const configDfa = {
        table: [],
        start: [],
        end: []

    };
    configDfa.endMap = {};

    const prev = getReachableStates(configOriginal.table, configOriginal.start);

    helper(configOriginal, configDfa, prev, monitor, true);

    return configDfa;
}

function helper(configOriginal, configDfa, prev, monitor, isStart = false) {
    const prevKey = prev.sort().join('_');

    if (monitor.processed[prevKey] === undefined) {
        monitor.processed[prevKey] = {};

        if (monitor.idMap[prevKey] === undefined) {
            const nextId = getNextId();
            monitor.idMap[prevKey] = nextId;

            if (isStart) {
                configDfa.start.push(nextId);
            }
            if (intersection(configOriginal.end, prev).length > 0) {
                configDfa.end.push(nextId);

                if (configOriginal.endMap) {
                    const func = prev.map(id => configOriginal.endMap[id]).filter(item => item !== undefined).sort((a, b) => a.priority - b.priority);

                    configDfa.endMap[nextId] = {
                        parseFunction: func[0].parseFunction
                    };
                }
            }
        }

        const jumps = configOriginal.table.filter(item => prev.indexOf(item.from) !== -1);

        jumps.forEach(jump => {
            if (jump._ft_ !== 'ε' && monitor.processed[prevKey][jump._ft_] === undefined) {
                monitor.processed[prevKey][jump._ft_] = true;
                _determinize(configOriginal, configDfa, prev, jump, monitor);
            }
        });
    }
}

function _determinize(configOriginal, configDfa, prev, _jump, monitor) {
    const next = getReachableStatesWithToken(configOriginal, prev, _jump._ft_, _jump._tt_);

    const prevKey = prev.sort().join('_');
    const nextKey = next.sort().join('_');

    if (monitor.idMap[nextKey] === undefined) {
        const nextId = getNextId();
        monitor.idMap[nextKey] = nextId;

        if (intersection(configOriginal.end, next).length > 0) {
            configDfa.end.push(nextId);

            if (configOriginal.endMap) {
                const func = next.map(id => configOriginal.endMap[id]).filter(item => item !== undefined).sort((a, b) => a.priority - b.priority);

                configDfa.endMap[nextId] = {
                    parseFunction: func[0].parseFunction
                };
            }
        }
    }

    configDfa.table.push({
        _ft_: _jump._ft_,
        _tt_: _jump._tt_,
        from: monitor.idMap[prevKey],
        to: monitor.idMap[nextKey]

    });

    helper(configOriginal, configDfa, next, monitor, false);
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Parser__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Lexer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rules_regexRules_groupProd__ = __webpack_require__(6);



function _parseTree(regexStructure) {
    const config = {
        lastId: 0,
        getNextId() {
            const n = this.lastId++;
            return `${n}`;
        },
        structure: {
            end: [],
            start: [],
            table: []

        }
    };

    const startId = config.getNextId(config);
    const endId = config.getNextId(config);

    config.structure.start.push(startId);
    config.structure.end.push(endId);

    _parseNode(config, regexStructure, startId, endId);
    return config.structure;
}

function _parseNode(config, rule, previous, next) {
    let newPrev, newNext, i;

    switch (rule.tokenType) {

        case 'char':
            config.structure.table.push({
                from: previous,
                to: next,
                _ft_: rule.rules[0],
                _tt_: rule.rules[0]

            });

            break;

        case 'range':

            config.structure.table.push({
                from: previous,
                to: next,
                _ft_: rule.rules[0].content,
                _tt_: rule.rules[1].content

            });

            break;

        case 'star':
            newPrev = config.getNextId(config);
            newNext = config.getNextId(config);

            config.structure.table.push({
                from: previous,
                to: next,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: newNext,
                to: newPrev,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: previous,
                to: newPrev,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: newNext,
                to: next,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            _parseNode(config, rule.rules[0], newPrev, newNext);

            break;

        case 'optional':

            newPrev = config.getNextId(config);

            newNext = config.getNextId(config);

            config.structure.table.push({
                from: newPrev,
                to: newNext,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: previous,
                to: newPrev,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: newNext,
                to: next,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            _parseNode(config, rule.rules[0], newPrev, newNext);

            break;

        case 'plus':
            newPrev = config.getNextId(config);

            newNext = config.getNextId(config);

            config.structure.table.push({
                from: newNext,
                to: newPrev,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: previous,
                to: newPrev,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            config.structure.table.push({
                from: newNext,
                to: next,
                _ft_: 'ε',
                _tt_: 'ε'

            });

            _parseNode(config, rule.rules[0], newPrev, newNext);

            break;

        case 'concat':

            for (i = 0; i < rule.rules.length - 1; i++) {
                newNext = config.getNextId(config);

                _parseNode(config, rule.rules[i], previous, newNext);

                previous = newNext;
            }

            if (next === undefined) {
                console.error('quando é k chega aki?');
            }

            _parseNode(config, rule.rules[i], previous, next);

            break;

        case 'or':

            for (i = 0; i < rule.rules.length; i++) {
                _parseNode(config, rule.rules[i], previous, next);
            }

            break;

        default:

            console.error('not parsed', rule.tokenType);

    }
}



function RegexToNfa(inputText) {
    const lexer = new __WEBPACK_IMPORTED_MODULE_1__Lexer__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__rules_regexRules_groupProd__["a" /* config */].lexerTable, false);
    const parser = new __WEBPACK_IMPORTED_MODULE_0__Parser__["a" /* default */](lexer, __WEBPACK_IMPORTED_MODULE_2__rules_regexRules_groupProd__["a" /* config */].parserTable);

    parser.parse(inputText);
    const a = parser.stack[0].rules;

    const sm = _parseTree(a);
    return sm;
    /*
    let det = determinize(sm)
    // return det;
    let min = minimize(det)
     return min
    */
}

/* harmony default export */ __webpack_exports__["a"] = (RegexToNfa);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
let Actions = {
    'shift': 0,
    'reduce': 1,
    'accept': 2,
    'goto': 2
};
*/

const config = {
    lexerTable: {
        INITIAL: {
            table: [{
                'from': '0',
                '_ft_': '?',
                '_tt_': '?',
                'to': '1'
            }, {
                'from': '0',
                '_ft_': '[',
                '_tt_': '[',
                'to': '2'
            }, {
                'from': '0',
                '_ft_': '.',
                '_tt_': '.',
                'to': '3'
            }, {
                'from': '0',
                '_ft_': ']',
                '_tt_': ']',
                'to': '4'
            }, {
                'from': '0',
                '_ft_': ')',
                '_tt_': ')',
                'to': '5'
            }, {
                'from': '0',
                '_ft_': '(',
                '_tt_': '(',
                'to': '6'
            }, {
                'from': '0',
                '_ft_': '|',
                '_tt_': '|',
                'to': '7'
            }, {
                'from': '0',
                '_ft_': '*',
                '_tt_': '*',
                'to': '8'
            }, {
                'from': '0',
                '_ft_': '+',
                '_tt_': '+',
                'to': '9'
            }, {
                'from': '0',
                '_ft_': '-',
                '_tt_': '-',
                'to': '10'
            }, {
                'from': '0',
                '_ft_': '\\',
                '_tt_': '\\',
                'to': '11'
            }, {
                'from': '11',
                '_ft_': 'x',
                '_tt_': 'x',
                'to': '12'
            }, {
                'from': '12',
                '_ft_': '0',
                '_tt_': '9',
                'to': '13'
            }, {
                'from': '13',
                '_ft_': '0',
                '_tt_': '9',
                'to': '14'
            }, {
                'from': '13',
                '_ft_': 'a',
                '_tt_': 'f',
                'to': '14'
            }, {
                'from': '12',
                '_ft_': 'a',
                '_tt_': 'f',
                'to': '13'
            }, {
                'from': '11',
                '_ft_': 'n',
                '_tt_': 'n',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': '?',
                '_tt_': '?',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': '$',
                '_tt_': '$',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': 'r',
                '_tt_': 't',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': '-',
                '_tt_': '.',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': '{',
                '_tt_': '}',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': '(',
                '_tt_': '+',
                'to': '14'
            }, {
                'from': '11',
                '_ft_': '[',
                '_tt_': '^',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': ',',
                '_tt_': ',',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': '~',
                '_tt_': '~',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': '_',
                '_tt_': 'z',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': '!',
                '_tt_': '#',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': '@',
                '_tt_': 'Z',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': '%',
                '_tt_': '\'',
                'to': '14'
            }, {
                'from': '0',
                '_ft_': '/',
                '_tt_': '>',
                'to': '14'
            }],
            endMap: {
                1: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '?'
                        };
                    }
                },
                2: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '['
                        };
                    }
                },
                3: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '.'
                        };
                    }
                },
                4: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: ']'
                        };
                    }
                },
                5: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: ')'
                        };
                    }
                },
                6: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '('
                        };
                    }
                },
                7: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '|'
                        };
                    }
                },
                8: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '*'
                        };
                    }
                },
                9: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '+'
                        };
                    }
                },
                10: {
                    parseFunction: function parseFunction(lexer) {
                        return {
                            tokenType: '-'
                        };
                    }
                },
                14: {
                    parseFunction: function parseFunction(lexer) {

                        return {
                            content: lexer.yytext,
                            tokenType: 'char'
                        };
                    }
                }
            },
            start: ['0'],
            end: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '14']

        }
    },
    parserTable: {
        table: {
            '0': {
                '.': [0, 14],
                '$': [0, 15],
                'char': [0, 16],
                'metachar': [0, 17],
                '(': [0, 19],
                '[': [0, 22],
                'startx': [2, 1],
                'RE': [2, 2],
                'or': [2, 20],
                'simpleRE': [2, 21],
                'concatenation': [2, 29],
                'basicRE': [2, 30],
                'star': [2, 6],
                'plus': [2, 7],
                'optional': [2, 8],
                'elementaryRE': [2, 9],
                'group': [2, 13],
                'range': [2, 18]
            },
            '1': {
                'eof': [2, 0]
            },
            '2': {
                'eof': [1, 1],
                '|': [0, 3]
            },
            '3': {
                '.': [0, 14],
                '$': [0, 15],
                'char': [0, 16],
                'metachar': [0, 17],
                '(': [0, 19],
                '[': [0, 22],
                'simpleRE': [2, 4],
                'concatenation': [2, 29],
                'basicRE': [2, 30],
                'star': [2, 6],
                'plus': [2, 7],
                'optional': [2, 8],
                'elementaryRE': [2, 9],
                'group': [2, 13],
                'range': [2, 18]
            },
            '4': {
                'eof': [1, 4],
                '|': [1, 4],
                '.': [0, 14],
                '$': [0, 15],
                'char': [0, 16],
                'metachar': [0, 17],
                '(': [0, 19],
                ')': [1, 4],
                '[': [0, 22],
                'basicRE': [2, 5],
                'star': [2, 6],
                'plus': [2, 7],
                'optional': [2, 8],
                'elementaryRE': [2, 9],
                'group': [2, 13],
                'range': [2, 18]
            },
            '5': {
                'eof': [1, 7],
                '|': [1, 7],
                '.': [1, 7],
                '$': [1, 7],
                'char': [1, 7],
                'metachar': [1, 7],
                '(': [1, 7],
                ')': [1, 7],
                '[': [1, 7]
            },
            '6': {
                'eof': [1, 8],
                '|': [1, 8],
                '.': [1, 8],
                '$': [1, 8],
                'char': [1, 8],
                'metachar': [1, 8],
                '(': [1, 8],
                ')': [1, 8],
                '[': [1, 8]
            },
            '7': {
                'eof': [1, 9],
                '|': [1, 9],
                '.': [1, 9],
                '$': [1, 9],
                'char': [1, 9],
                'metachar': [1, 9],
                '(': [1, 9],
                ')': [1, 9],
                '[': [1, 9]
            },
            '8': {
                'eof': [1, 10],
                '|': [1, 10],
                '.': [1, 10],
                '$': [1, 10],
                'char': [1, 10],
                'metachar': [1, 10],
                '(': [1, 10],
                ')': [1, 10],
                '[': [1, 10]
            },
            '9': {
                'eof': [1, 11],
                '|': [1, 11],
                '*': [0, 10],
                '+': [0, 11],
                '?': [0, 12],
                '.': [1, 11],
                '$': [1, 11],
                'char': [1, 11],
                'metachar': [1, 11],
                '(': [1, 11],
                ')': [1, 11],
                '[': [1, 11]
            },
            '10': {
                'eof': [1, 12],
                '|': [1, 12],
                '.': [1, 12],
                '$': [1, 12],
                'char': [1, 12],
                'metachar': [1, 12],
                '(': [1, 12],
                ')': [1, 12],
                '[': [1, 12]
            },
            '11': {
                'eof': [1, 13],
                '|': [1, 13],
                '.': [1, 13],
                '$': [1, 13],
                'char': [1, 13],
                'metachar': [1, 13],
                '(': [1, 13],
                ')': [1, 13],
                '[': [1, 13]
            },
            '12': {
                'eof': [1, 14],
                '|': [1, 14],
                '.': [1, 14],
                '$': [1, 14],
                'char': [1, 14],
                'metachar': [1, 14],
                '(': [1, 14],
                ')': [1, 14],
                '[': [1, 14]
            },
            '13': {
                'eof': [1, 15],
                '|': [1, 15],
                '*': [1, 15],
                '+': [1, 15],
                '?': [1, 15],
                '.': [1, 15],
                '$': [1, 15],
                'char': [1, 15],
                'metachar': [1, 15],
                '(': [1, 15],
                ')': [1, 15],
                '[': [1, 15]
            },
            '14': {
                'eof': [1, 16],
                '|': [1, 16],
                '*': [1, 16],
                '+': [1, 16],
                '?': [1, 16],
                '.': [1, 16],
                '$': [1, 16],
                'char': [1, 16],
                'metachar': [1, 16],
                '(': [1, 16],
                ')': [1, 16],
                '[': [1, 16]
            },
            '15': {
                'eof': [1, 17],
                '|': [1, 17],
                '*': [1, 17],
                '+': [1, 17],
                '?': [1, 17],
                '.': [1, 17],
                '$': [1, 17],
                'char': [1, 17],
                'metachar': [1, 17],
                '(': [1, 17],
                ')': [1, 17],
                '[': [1, 17]
            },
            '16': {
                'eof': [1, 18],
                '|': [1, 18],
                '*': [1, 18],
                '+': [1, 18],
                '?': [1, 18],
                '.': [1, 18],
                '$': [1, 18],
                'char': [1, 18],
                'metachar': [1, 18],
                '(': [1, 18],
                ')': [1, 18],
                '[': [1, 18]
            },
            '17': {
                'eof': [1, 19],
                '|': [1, 19],
                '*': [1, 19],
                '+': [1, 19],
                '?': [1, 19],
                '.': [1, 19],
                '$': [1, 19],
                'char': [1, 19],
                'metachar': [1, 19],
                '(': [1, 19],
                ')': [1, 19],
                '[': [1, 19]
            },
            '18': {
                'eof': [1, 20],
                '|': [1, 20],
                '*': [1, 20],
                '+': [1, 20],
                '?': [1, 20],
                '.': [1, 20],
                '$': [1, 20],
                'char': [1, 20],
                'metachar': [1, 20],
                '(': [1, 20],
                ')': [1, 20],
                '[': [1, 20]
            },
            '19': {
                '.': [0, 14],
                '$': [0, 15],
                'char': [0, 16],
                'metachar': [0, 17],
                '(': [0, 19],
                '[': [0, 22],
                'RE': [2, 27],
                'or': [2, 20],
                'simpleRE': [2, 21],
                'concatenation': [2, 29],
                'basicRE': [2, 30],
                'star': [2, 6],
                'plus': [2, 7],
                'optional': [2, 8],
                'elementaryRE': [2, 9],
                'group': [2, 13],
                'range': [2, 18]
            },
            '20': {
                'eof': [1, 2],
                '|': [1, 2],
                ')': [1, 2]
            },
            '21': {
                'eof': [1, 3],
                '|': [1, 3],
                '.': [0, 14],
                '$': [0, 15],
                'char': [0, 16],
                'metachar': [0, 17],
                '(': [0, 19],
                ')': [1, 3],
                '[': [0, 22],
                'basicRE': [2, 5],
                'star': [2, 6],
                'plus': [2, 7],
                'optional': [2, 8],
                'elementaryRE': [2, 9],
                'group': [2, 13],
                'range': [2, 18]
            },
            '22': {
                'char': [0, 23]
            },
            '23': {
                '-': [0, 24]
            },
            '24': {
                'char': [0, 25]
            },
            '25': {
                ']': [0, 26]
            },
            '26': {
                'eof': [1, 22],
                '|': [1, 22],
                '*': [1, 22],
                '+': [1, 22],
                '?': [1, 22],
                '.': [1, 22],
                '$': [1, 22],
                'char': [1, 22],
                'metachar': [1, 22],
                '(': [1, 22],
                ')': [1, 22],
                '[': [1, 22]
            },
            '27': {
                '|': [0, 3],
                ')': [0, 28]
            },
            '28': {
                'eof': [1, 21],
                '|': [1, 21],
                '*': [1, 21],
                '+': [1, 21],
                '?': [1, 21],
                '.': [1, 21],
                '$': [1, 21],
                'char': [1, 21],
                'metachar': [1, 21],
                '(': [1, 21],
                ')': [1, 21],
                '[': [1, 21]
            },
            '29': {
                'eof': [1, 5],
                '|': [1, 5],
                '.': [1, 5],
                '$': [1, 5],
                'char': [1, 5],
                'metachar': [1, 5],
                '(': [1, 5],
                ')': [1, 5],
                '[': [1, 5]
            },
            '30': {
                'eof': [1, 6],
                '|': [1, 6],
                '.': [1, 6],
                '$': [1, 6],
                'char': [1, 6],
                'metachar': [1, 6],
                '(': [1, 6],
                ')': [1, 6],
                '[': [1, 6]
            }
        },
        states: [{
            create: 'G',
            base: ['startx'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'startx',
            base: ['RE'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'RE',
            base: ['or'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'RE',
            base: ['simpleRE'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'or',
            base: ['RE', '|', 'simpleRE'],
            action: function action(args) {

                return {
                    'tokenType': 'or',
                    rules: [args[0].rules, args[2].rules]
                };
            }
        }, {
            create: 'simpleRE',
            base: ['concatenation'],
            action: function action(args) {
                return {
                    'tokenType': 'concat',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'simpleRE',
            base: ['basicRE'],
            action: function action(args) {

                return {
                    'tokenType': 'concat',

                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'concatenation',
            base: ['simpleRE', 'basicRE'],
            action: function action(args) {

                return {
                    'tokenType': 'concat',

                    rules: [args[0].rules, args[1].rules]
                };
            }
        }, {
            create: 'basicRE',
            base: ['star'],
            action: function action(args) {

                return args[0].rules;
            }
        }, {
            create: 'basicRE',
            base: ['plus'],
            action: function action(args) {

                return args[0].rules;
            }
        }, {
            create: 'basicRE',
            base: ['optional'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'basicRE',
            base: ['elementaryRE'],
            action: function action(args) {

                return args[0].rules;
            }
        }, {
            create: 'star',
            base: ['elementaryRE', '*'],
            action: function action(args) {

                return {
                    'tokenType': 'star',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'plus',
            base: ['elementaryRE', '+'],
            action: function action(args) {

                return {
                    'tokenType': 'plus',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'optional',
            base: ['elementaryRE', '?'],
            action: function action(args) {

                return {
                    'tokenType': 'optional',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['group'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'elementaryRE',
            base: ['.'],
            action: function action(args) {
                return {
                    'tokenType': '.',
                    rules: args[0].content
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['$'],
            action: function action(args) {
                return {
                    'tokenType': '$',
                    rules: args[0].content
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['char'],
            action: function action(args) {

                if (args[0].content.indexOf('\\s') === 0) {

                    args[0].content = ' ';
                }

                if (args[0].content.indexOf('\\t') === 0) {

                    args[0].content = '\t';
                }

                if (args[0].content.indexOf('\\r') === 0) {

                    args[0].content = '\r';
                }

                if (args[0].content.indexOf('\\n') === 0) {

                    args[0].content = '\n';
                }

                if (args[0].content.indexOf('\\x') === 0) {

                    args[0].content = String.fromCharCode(parseInt(args[0].content.replace('\\x', '0x')));
                }
                if (args[0].content.indexOf('\\') === 0) {

                    args[0].content = args[0].content.replace('\\', '');
                }

                return {
                    'tokenType': 'char',
                    rules: args[0].content
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['metachar'],
            action: function action(args) {

                return {
                    'tokenType': 'char',
                    rules: ':' // args[0].content,
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['range'],
            action: function action(args) {
                return args[0].rules;
            }
        }, {
            create: 'group',
            base: ['(', 'RE', ')'],
            action: function action(args) {
                return args[1].rules;
            }
        }, {
            create: 'range',
            base: ['[', 'char', '-', 'char', ']'],
            action: function action(args) {
                if (args[1].content.indexOf('\\x') === 0) {

                    args[1].content = String.fromCharCode(parseInt(args[1].content.replace('\\x', '0x')));
                }

                if (args[3].content.indexOf('\\x') === 0) {

                    args[3].content = String.fromCharCode(parseInt(args[3].content.replace('\\x', '0x')));
                }

                if (args[1].content.indexOf('\\') === 0) {

                    args[1].content = args[1].content.replace('\\', '');
                }

                if (args[3].content.indexOf('\\') === 0) {

                    args[3].content = args[3].content.replace('\\', '');
                }

                return {
                    'tokenType': 'range',
                    rules: [args[1], args[3]]
                };
            }
        }]
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = config;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = minimize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getStateList__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__expandTable__ = __webpack_require__(1);



function intersept(array1, array2) {
    return array1.filter(function (n) {
        return array2.indexOf(n) !== -1;
    });
}

function unicos(myArray) {
    return [...new Set(myArray)];
}

function minimize(originalStructure) {

    const expandedTable = Object(__WEBPACK_IMPORTED_MODULE_1__expandTable__["a" /* default */])(originalStructure.table);
    const statesList = Object(__WEBPACK_IMPORTED_MODULE_0__getStateList__["a" /* default */])(expandedTable);

    statesList.push('sink');

    let theListUnique = {};

    let unprocessed = [];

    let theTable = {};

    // extend table to be easyly walked
    for (let i = 0; i < originalStructure.table.length; i++) {
        let n = originalStructure.table[i];

        if (theTable[n.from] === undefined) {
            theTable[n.from] = {};
        }
        theTable[n.from][n._ft_] = n.to;
    }

    // criar a lista inicial com os pares unicos, e nao processados
    for (let i = 0; i < statesList.length - 1; i++) {
        if (theListUnique[statesList[i]] === undefined) {

            theListUnique[statesList[i]] = {};
        }

        for (let j = i + 1; j < statesList.length; j++) {

            if (theListUnique[statesList[j]] === undefined) {

                theListUnique[statesList[j]] = {};
            }

            if (originalStructure.end.indexOf(statesList[i]) !== -1 !== (originalStructure.end.indexOf(statesList[j]) !== -1)) {

                theListUnique[statesList[i]][statesList[j]] = true;
                theListUnique[statesList[j]][statesList[i]] = true;
            } else {
                unprocessed.push([statesList[i], statesList[j]]);
            }
        }
    }

    let lastCount = 0;
    if (lastCount !== unprocessed.length) {
        lastCount = unprocessed.length;

        for (let x = 0; x < lastCount; x++) {
            isUniqueAll(theTable, theListUnique, unprocessed);
        }
    }

    // unprocessed = [[2, 3], [2, 5], [5, 4], [8, 1]]
    let processed = [];

    let unprocessedLen = 0; // unprocessed.length;


    while (unprocessedLen !== unprocessed.length) {

        unprocessedLen = unprocessed.length;

        let current;
        while (current = unprocessed.pop()) {

            let find = false;
            for (let i = 0; !find && i < processed.length; i++) {
                if (intersept(processed[i], current).length > 0) {
                    console.log(processed[i], current);

                    processed[i] = unicos(processed[i].concat(current));

                    find = true;
                }
            }

            if (!find) {
                processed.push(current);
            }
        }

        unprocessed = processed;
        processed = [];
    }

    let map = {};

    unprocessed.forEach(function (item) {
        let name = item.join(',');
        item.forEach(function (stat) {

            map[stat] = name;
        });
    });

    originalStructure.table.forEach(function (xx) {
        xx.from = map[xx.from] ? map[xx.from] : xx.from;
        xx.to = map[xx.to] ? map[xx.to] : xx.to;
    });

    for (let i = 0; i < originalStructure.end.length; i++) {
        originalStructure.end[i] = map[originalStructure.end[i]] ? map[originalStructure.end[i]] : originalStructure.end[i];
    }

    for (let i = 0; i < originalStructure.start.length; i++) {
        originalStructure.start[i] = map[originalStructure.start[i]] ? map[originalStructure.start[i]] : originalStructure.start[i];
    }

    let table = [];

    while (originalStructure.table.length) {
        let temp = originalStructure.table.pop();
        table.push(temp);

        originalStructure.table = originalStructure.table.filter(function (item) {
            return item._ft_ !== temp._ft_ || item._tt_ !== temp._tt_ || item.from !== temp.from || item.to !== temp.to;
        });
    }

    originalStructure.table = table;

    return originalStructure;
}

function isUniqueAll(theTable, theListUnique, unprocessed) {

    let item = unprocessed.pop();

    let l1 = theTable[item[0]];

    let l2 = theTable[item[1]];

    let tokens1 = l1 === undefined ? [] : Object.keys(l1);
    let tokens2 = l2 === undefined ? [] : Object.keys(l2);
    let tokenList = unicos(tokens1.concat(tokens2));

    for (let i = 0; i < tokenList.length; i++) {

        let token = tokenList[i];

        let to1 = theTable[item[0]] && theTable[item[0]][token] ? theTable[item[0]][token] : 'sink';
        let to2 = theTable[item[1]] && theTable[item[1]][token] ? theTable[item[1]][token] : 'sink';

        let isUniqueX = theListUnique[to1] && theListUnique[to1][to2] ? true : false;

        if (isUniqueX) {

            theListUnique[item[0]][item[1]] = true;
            theListUnique[item[1]][item[0]] = true;
            return true;
        }
    }

    unprocessed.unshift(item);

    return false;
}

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Parser__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_Lexer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_GenerateLalrParser__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rules_calc_lexRules__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__rules_calc_parserRules__ = __webpack_require__(17);








const parserTable = Object(__WEBPACK_IMPORTED_MODULE_2__classes_GenerateLalrParser__["a" /* createParser */])(__WEBPACK_IMPORTED_MODULE_4__rules_calc_parserRules__["a" /* parserRules */]);

for (let i in __WEBPACK_IMPORTED_MODULE_3__rules_calc_lexRules__["a" /* lexerRules */]) {
    let item = __WEBPACK_IMPORTED_MODULE_3__rules_calc_lexRules__["a" /* lexerRules */][i];

    for (let j in item.endMap) {
        let item2 = item.endMap[j];
        delete item2.tokenType;
        delete item2.priority;
    }
}

let lexer = new __WEBPACK_IMPORTED_MODULE_1__classes_Lexer__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3__rules_calc_lexRules__["a" /* lexerRules */], false);

let parser = new __WEBPACK_IMPORTED_MODULE_0__classes_Parser__["a" /* default */](lexer, parserTable);

parser.parse('3 -65 / 17  -5 * ( 5 / 12 ) * 3');
let ast = parser.stack[0].rules;

function mdc(a, b) {
    let resto = a % b;
    if (resto === 0) {
        return b;
    } else {

        return mdc(b, resto);
    }
}

function simplify(tree) {
    switch (tree.type) {

        case 'number':
            return false;
            break;

        case 'sum':

            if (tree.child[0].type === 'number' && tree.child[1].type === 'number') {

                tree.type = 'number';
                tree.child = [tree.child[0].child[0] + tree.child[1].child[0]];
                return true;
            }

            if (tree.child[0].type === 'number' && tree.child[1].type === 'sum') {

                if (tree.child[1].child[0].type === 'number') {

                    tree.child = [tree.child[0].child[0] + tree.child[1].child[0].child[0], tree.child[1].child[1]];

                    return true;
                }

                if (tree.child[1].child[1].type === 'number') {

                    tree.child = [tree.child[0].child[0] + tree.child[1].child[1].child[0], tree.child[1].child[0]];

                    return true;
                }
            }

            if (tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number' && tree.child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0].child[0] + tree.child[1].child[0] * tree.child[0].child[1].child[0]] }, tree.child[0].child[1]];

                return true;
            }

            if (tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number' && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0].child[0] * tree.child[1].child[1].child[0] + tree.child[1].child[0].child[0] * tree.child[0].child[1].child[0]] }, { type: 'number', child: [tree.child[0].child[1].child[0] * tree.child[1].child[1].child[0]] }];
                return true;
            }

            break;

        case '-':

            if (tree.child[0].type === 'number' && tree.child[1].type === 'number') {

                tree.type = 'number';
                tree.child = [tree.child[0].child[0] - tree.child[1].child[0]];

                return true;
            }

            if (tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number' && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0].child[0] * tree.child[1].child[1].child[0] - tree.child[1].child[0].child[0] * tree.child[0].child[1].child[0]] }, { type: 'number', child: [tree.child[0].child[1].child[0] * tree.child[1].child[1].child[0]] }];

                return true;
            }

            //    3  - (2 /3)

            if (tree.child[0].type === 'number' && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0] * tree.child[1].child[1].child[0] - tree.child[1].child[0].child[0]] }, tree.child[1].child[1]];
                return true;
            }

            // (23 / 42 )  - 23
            if (tree.child[1].type === 'number' && tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0].child[0] - tree.child[1].child[0] * tree.child[0].child[1].child[0]] }, tree.child[0].child[1]];
                return true;
            }

            break;

        case 'product':

            if (tree.child[0].type === 'number' && tree.child[1].type === 'number') {
                tree.type = 'number';
                tree.child = [tree.child[0].child[0] * tree.child[1].child[0]];
                return true;
            }

            if (tree.child[0].type === 'product' && tree.child[0].child[0].type === 'number' && tree.child[1].type === 'number') {

                tree.type = 'product';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0].child[0] * tree.child[1].child[0]] }, tree.child[0].child[1]];
                return true;
            }

            if (tree.child[0].type === 'number' && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0] * tree.child[1].child[0].child[0]] }, tree.child[1].child[1]];
                return false;
            }

            if (tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[1].child[0] * tree.child[0].child[0].child[0]] }, tree.child[0].child[1]];
                return true;
            }

            if (tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number' && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number') {

                tree.type = '/';
                tree.child = [{ type: 'number', child: [tree.child[0].child[0].child[0] * tree.child[1].child[0].child[0]] }, { type: 'number', child: [tree.child[0].child[1].child[0] * tree.child[1].child[1].child[0]] }];
                return true;
            }

            break;

        case '/':

            if (tree.child[0].type === 'number' && tree.child[1].type === 'number') {

                let d = mdc(Math.max(tree.child[0].child[0], tree.child[1].child[0]), Math.min(tree.child[0].child[0], tree.child[1].child[0]));

                if (d === 1) {
                    return false;
                }

                if (d === tree.child[1].child[0]) {
                    tree.type = 'number';
                    tree.child = [tree.child[0].child[0] / d];
                    return true;
                }

                tree.child = [{ type: 'number', child: [tree.child[0].child[0] / d] }, { type: 'number', child: [tree.child[1].child[0] / d] }];
                return true;
            }
            break;

    }

    let changed = false;
    // console.log(tree);
    for (let i = 0; i < tree.child.length; i++) {
        changed = changed || simplify(tree.child[i]);
    }

    return changed;
}

function printExp(tree) {
    switch (tree.type) {
        case 'number':
            return tree.child[0];
            break;

        case 'sum':

            return '(' + printExp(tree.child[0]) + ' + ' + printExp(tree.child[1]) + ' ) ';
            break;

        case '-':

            return '(' + printExp(tree.child[0]) + ' - ' + printExp(tree.child[1]) + ' ) ';
            break;

        case 'product':

            return '(' + printExp(tree.child[0]) + ' * ' + printExp(tree.child[1]) + ' ) ';
            break;

        case '/':
            return '(' + printExp(tree.child[0]) + ' / ' + printExp(tree.child[1]) + ' ) ';
            break;

    }

    for (let i = 0; i < tree.child.length; i++) {
        tree.child[i] = simplify(tree.child[i]);
    }

    return tree;
}

console.log(printExp(ast));

while (simplify(ast)) {
    console.log(printExp(ast));
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createParser;

let Actions = {
    'shift': 0,
    'reduce': 1,
    'accept': 2,
    'goto': 2
};

function createParser(parserRules) {
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

    function getEmptyJumpsDest(stateArray) {
        const listaDeCoisas = stateArray.map(id => list.filter(item => item.state.create == list[id].state.base[list[id].pos] && item.pos === 0));

        const xxx = listaDeCoisas.map(a => a.map(b => b.id));

        const flattened = stateArray.concat(xxx.reduce((a, b) => a.concat(b), [])).unique().sort((a, b) => a - b);

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

    function getSimpleEmptyJumpsDest(stateArrayParam) {
        let simple = [];

        stateArrayParam.map(id => list[id].emptyJumps).forEach(l => {
            simple = simple.concat(l);
        });

        return simple.unique().sort((a, b) => a - b);
    }

    function addToMonitor(stateArray) {
        const _idsDestino = stateArray;

        const stateArrayKey = _idsDestino.join('-');

        if (monitor[stateArrayKey] === undefined) {
            const xxID = lastId++;

            stateArray.forEach(i => {
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

    function parseTree(origens) {
        const origensStatesId = addToMonitor(origens);

        if (monitor[origensStatesId.key].processed === false) {
            monitor[origensStatesId.key].processed = true;

            const theState = {};

            const tokens = origens.map(id => list[id].state.base[list[id].pos]).filter(item => item !== undefined).unique();

            for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
                const token = tokens[tokenIdx];

                let dest = [];

                origens.map(origensId => {
                    const origem = list[origensId];

                    const p = list.filter(st => st.state.id === origem.state.id && st.pos === origem.pos + 1 && st.state.base[st.pos - 1] === token).map(s => s.id);

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

    const terminals = Object.keys(firstMap).filter(item => firstMap[item].isTerminal);
    terminals.unshift('eof');

    const nonTerminals = Object.keys(firstMap).filter(item => firstMap[item].isTerminal === false);

    const result = {};

    for (stateId in table) {
        result[stateId] = {};

        const reduceList = {};

        newIdToNfa[stateId].filter(stateId => list[stateId].reduce).forEach(stateId => {
            const state = list[stateId].state;

            firstMap[state.create].follows.forEach(follow => {
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

                const xxx = stateIds.map(stateId => {
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
                result[stateId][token] = [_list[0].action, _list[0].action === Actions.shift ? _list[0].to : _list[0].stateId // list[stateId].state
                ];

                continue;
            }

            if (_list.length > 1) {
                if (_list[0].prec.type === 'left' && _list[1].prec.type === 'left' || _list[0].prec.type === 'none' && _list[1].prec.type === 'none' || _list[0].prec.type !== _list[1].prec.type) {
                    result[stateId][token] = [_list[0].action, _list[0].action === Actions.shift ? _list[0].to : _list[0].stateId // list[stateId].state
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
                result[stateId][_token] = [Actions.goto, _goto];
            }
        }
    }

    const states = Object.keys(stateList).map(stateId => {
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

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_RegexToDfa__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_StateMachineDependency_Determinizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_GrammarMixer__ = __webpack_require__(16);


let lexerRulesList = [];
let WHITESPACE = '(\\n|\\r|\\t|\\s)';

function defaultRuleType(lexer) {
    return {
        tokenType: lexer.yytext
    };
}

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '[0-9]+(\\.[0-9]*)?',
    parseFunction: function (lexer) {

        return {
            content: parseFloat(lexer.yytext),
            tokenType: 'NUMBER'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: ',',
    parseFunction: defaultRuleType
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: 'pi',
    parseFunction: function (lexer) {
        return {
            // tokenType: 'PI'
            content: 'PI',
            tokenType: 'CONST'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: 'sqrt',
    parseFunction: function (lexer) {
        return {
            tokenType: 'SQRT'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: 'cos',
    parseFunction: function (lexer) {
        return {
            tokenType: 'COS'
        };
    }
});
lexerRulesList.push({
    onState: 'INITIAL',
    regex: 'sin',
    parseFunction: function (lexer) {
        return {
            tokenType: 'SIN'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\(',
    parseFunction: function (lexer) {

        return {
            tokenType: '('
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\)',
    parseFunction: function (lexer) {

        return {
            tokenType: ')'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\+',
    parseFunction: function (lexer) {

        return {
            tokenType: '+'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\^',
    parseFunction: function (lexer) {

        return {
            tokenType: '^'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\-',
    parseFunction: function (lexer) {

        return {
            tokenType: '-'
        };
    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\*',
    parseFunction: function (lexer) {

        return {
            tokenType: '*'
        };
    }
});
lexerRulesList.push({
    onState: 'INITIAL',
    regex: '/',
    parseFunction: defaultRuleType
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: `(${WHITESPACE})+`,
    parseFunction: function (lexer) {
        return {
            tokenType: 'WHITESPACE'
        };
    }
});




let onStates = [...new Set(lexerRulesList.map(function (item) {
    return item.onState;
}))];

lexerRulesList.forEach(function (state, index) {
    lexerRulesList[index].sm = Object(__WEBPACK_IMPORTED_MODULE_0__classes_RegexToDfa__["a" /* default */])(state.regex);
});

let lista = {};

onStates.forEach(function (onState) {

    let l = lexerRulesList.filter(function (item) {
        return item.onState === onState;
    });

    lista[onState] = Object(__WEBPACK_IMPORTED_MODULE_1__classes_StateMachineDependency_Determinizer__["a" /* determinize */])(Object(__WEBPACK_IMPORTED_MODULE_2__classes_GrammarMixer__["a" /* grammarMixer */])(l));
});

const lexerRules = lista;
/* harmony export (immutable) */ __webpack_exports__["a"] = lexerRules;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StateMachineDependency_Minimizer__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StateMachineDependency_Determinizer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RegexToNfa__ = __webpack_require__(5);



// import { dotRenderer } from './StateMachineDependency/DotRenderer';



function RegexToDfa(regex) {

    let sm = Object(__WEBPACK_IMPORTED_MODULE_2__RegexToNfa__["a" /* default */])(regex);

    // dotRenderer(sm);


    let det = Object(__WEBPACK_IMPORTED_MODULE_1__StateMachineDependency_Determinizer__["a" /* determinize */])(sm);

    // dotRenderer(det);


    let min = Object(__WEBPACK_IMPORTED_MODULE_0__StateMachineDependency_Minimizer__["a" /* minimize */])(det);

    return min;
}

/* harmony default export */ __webpack_exports__["a"] = (RegexToDfa);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = grammarMixer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getStateList__ = __webpack_require__(0);


function grammarMixer(lexerList) {
    const structure = {
        endMap: {},
        end: [],
        start: [],
        table: []

    };

    let lastId = 0;

    function getNextId() {
        const n = lastId++;
        return `${n}`;
    }

    const map = {};

    for (let l = 0; l < lexerList.length; l++) {
        const lexema = lexerList[l];
        lexema.priority = l;
        map[lexema.tokenType] = {};

        const stateList = Object(__WEBPACK_IMPORTED_MODULE_0__getStateList__["a" /* default */])(lexema.sm.table);

        stateList.forEach(stateId => map[lexema.tokenType][stateId] = getNextId());

        lexema.sm.table.forEach(jump => {
            structure.table.push({
                from: map[lexema.tokenType][jump.from],
                to: map[lexema.tokenType][jump.to],
                _ft_: jump._ft_,
                _tt_: jump._tt_
            });
        });

        lexema.sm.start.forEach(stateId => {
            structure.start.push(map[lexema.tokenType][stateId]);
        });

        lexema.sm.end.forEach(stateId => {
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

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const parserRules = {
    start: 'G',
    ignoreTokens: ['WHITESPACE'],
    'precedence': [{
        type: 'left',
        tokens: ['+', '-']
    }, {
        type: 'left',
        tokens: ['*', '/']
    }, {
        type: 'left',
        tokens: ['^']
    }, {
        type: 'left',
        tokens: ['UMINUS']
    }],
    states: {
        G: {
            rules: [{
                rule: ['expr'],
                action: function (args) {

                    return args[0].rules;
                }
            }]
        },

        expr: {
            rules: [{
                rule: ['NUMBER'],
                action: function (args) {

                    return {

                        type: 'number',
                        child: [args[0].content]

                        // value: args[0].content
                    };
                }
            }, {
                rule: ['SQRT', '(', 'expr', ')'],
                action: function (args) {
                    return {

                        type: 'SQRT',
                        child: [args[2].rules]
                        // value: Math.sqrt(args[2].rules.value)
                    };
                }
            }, {
                rule: ['SIN', '(', 'expr', ')'],
                action: function (args) {
                    return {

                        type: 'SIN',
                        child: [args[2].rules]
                        // value: Math.sin(args[2].rules.value)
                    };
                }
            }, {
                rule: ['COS', '(', 'expr', ')'],
                action: function (args) {
                    return {

                        type: 'COS',
                        child: [args[2].rules]
                        // value: Math.cos(args[2].rules.value)
                    };
                }
            }, {
                rule: ['expr', '*', 'expr'],
                action: function (args) {
                    return {

                        type: 'product',
                        child: [args[0].rules, args[2].rules]
                        // value: args[0].rules.value * args[2].rules.value
                    };
                }
            }, {
                rule: ['expr', '/', 'expr'],
                action: function (args) {
                    return {

                        type: '/',
                        child: [args[0].rules, args[2].rules]

                        // value: args[0].rules.value / args[2].rules.value
                    };
                }
            }, {
                rule: ['expr', '+', 'expr'],
                action: function (args) {

                    return {

                        type: 'sum',
                        child: [args[0].rules, args[2].rules]

                        // value: args[0].rules.value + args[2].rules.value
                    };
                }
            }, {
                rule: ['expr', '-', 'expr'],

                action: function (args) {

                    return {

                        type: '-',
                        child: [args[0].rules, args[2].rules]

                        // value: args[0].rules.value - args[2].rules.value
                    };
                }
            }, {
                rule: ['expr', '^', 'expr'],

                action: function (args) {

                    return {

                        type: 'power',
                        child: [args[0].rules, args[2].rules]
                    };
                }
            }, {
                rule: ['(', 'expr', ')'],
                action: function (args) {
                    return args[1].rules;
                }
            }, {
                rule: ['-', 'expr'],
                prec: 'UMINUS',
                action: function (args) {

                    return {
                        type: 'negative',
                        child: [args[1].rules]
                    };
                }
            }]
        }
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = parserRules;


/***/ })
/******/ ]);