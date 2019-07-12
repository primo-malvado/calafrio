

import RegexToDfa from '../../classes/RegexToDfa';

let lexerRulesList = [];
let WHITESPACE = '(\\n|\\r|\\t|\\s)';

function defaultRuleType (lexer){
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
