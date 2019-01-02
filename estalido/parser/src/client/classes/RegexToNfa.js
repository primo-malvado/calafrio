import Parser from './Parser';
import Lexer from './Lexer';


function _parseTree (regexStructure) {
    const config = {
        lastId: 0,
        getNextId () {
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

function _parseNode (config, rule, previous, next) {
    let newPrev,
        newNext,
        i;

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


import { config as regexConfig} from '../rules/regexRules/groupProd';


function RegexToNfa (inputText) {
    const lexer = new Lexer(regexConfig.lexerTable, false);
    const parser = new Parser(lexer, regexConfig.parserTable);

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

export default RegexToNfa;
