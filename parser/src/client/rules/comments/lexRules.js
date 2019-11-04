import RegexToDfa from '../../classes/RegexToDfa';


let lexerRulesList = [];
let WHITESPACE = '(\\n|\\r|\\t|\\s)';

let comentRegex = '/(\\*)(/|[a-z]|[A-Z]|\\r|\\n|\\s)*(\\*)+(([a-z]|[A-Z]|\\r|\\n|\\s)(/|[a-z]|[A-Z]|\\r|\\n|\\s)*(\\*))*/';

lexerRulesList.push({
    onState: 'INITIAL',
    returnFirst: true,

    regex: comentRegex,

    parseFunction: function (lexer) {
        return {
            content: lexer.yytext,
            tokenType: 'COMMENT'
        };
    }
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

import { determinize } from '../../classes/StateMachineDependency/Determinizer';
import { grammarMixer } from '../../classes/GrammarMixer';

let onStates = [...new Set(lexerRulesList.map(function (item) {
    return item.onState;
}))];

lexerRulesList.forEach(function (state, index) {
    lexerRulesList[index].sm = RegexToDfa(state.regex);
});

let lista = {};

onStates.forEach(function (onState) {

    let l = lexerRulesList.filter(function (item) {
        return item.onState === onState;
    });

    lista[onState] = determinize(
        grammarMixer(l)
    );

});

export const lexerRules = lista;
