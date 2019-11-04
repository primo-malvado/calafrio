import RegexToDfa from '../../classes/RegexToDfa';

import { config } from '../regexRules/groupProd';

let lexerRulesList = [];

let WHITESPACE = '(\\n|\\r|\\t|\\s)';

lexerRulesList.push({
    onState: 'INITIAL',
    regex: ',',
    parseFunction: function (lexer) {
        return {
            tokenType: ','
        };

    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '(int)|(string)',
    parseFunction: function (lexer) {
        return {
            content: lexer.yytext,
            tokenType: 'TYPE'
        };

    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\$[a-z]+',
    parseFunction: function (lexer) {
        return {
            content: lexer.yytext,
            tokenType: 'IDENTIFIER'
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
    regex: `(${WHITESPACE})+`,
    parseFunction: function (lexer) {
        return {
            tokenType: 'WHITESPACE'
        };
    }
});

// import { minimize } from "../../classes/StateMachineDependency/Minimizer";
import { determinize } from '../../classes/StateMachineDependency/Determinizer';
import { grammarMixer } from '../../classes/GrammarMixer';

let onStates = [...new Set(lexerRulesList.map(function (item) {
    return item.onState;
}))];

lexerRulesList.forEach(function (state, index) {
    lexerRulesList[index].sm = RegexToDfa(state.regex, config);
});

let lista = {};

onStates.forEach(function (onState) {

    let l = lexerRulesList.filter(function (item) {
        return item.onState === onState;
    });

    let mmm = grammarMixer(l);

    lista[onState] =
        // minimize(
        determinize(
            mmm
        );
    // );

});

export const lexerRules = lista;
