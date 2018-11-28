import RegexToDfa from '../../classes/RegexToDfa';

import { config } from '../regexRules/groupProd';

let lexerRulesList = [];

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\?',
    parseFunction: function (lexer) {
        return {
            tokenType: '?'
        };

    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\[',
    parseFunction: function (lexer) {
        return {
            tokenType: '['
        };

    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\.',
    parseFunction: function (lexer) {
        return {
            tokenType: '.'
        };

    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\]',
    parseFunction: function (lexer) {
        return {
            tokenType: ']'
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
    regex: '\\(',
    parseFunction: function (lexer) {
        return {
            tokenType: '('
        };

    }
});

lexerRulesList.push({
    onState: 'INITIAL',
    regex: '\\|',
    parseFunction: function (lexer) {
        return {
            tokenType: '|'
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
    regex: '\\+',
    parseFunction: function (lexer) {
        return {
            tokenType: '+'
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
    regex: '((\\\\)\\.|%|/|&|#|`|"|:|_|!|<|\'|>|,|@|~|=|;|[a-z]|[0-9]|[A-Z]|((\\\\)x([0-9]|[a-f])([0-9]|[a-f]))|(\\\\)s|(\\\\)t|(\\\\)r|(\\\\)n|(\\\\)\\?|(\\\\)\\+|(\\\\)\\*|(\\\\)\\-|(\\\\)\\$|(\\\\)\\||(\\\\)\\{|(\\\\)\\}|(\\\\)\\]|(\\\\)\\(|(\\\\)\\)|(\\\\)\\[|(\\\\)\\^|(\\\\)\\{|(\\\\)(\\\\))',

    parseFunction: function (lexer) {

        return {
            content: lexer.yytext,
            tokenType: 'char'
        };

    }
});

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

    lista[onState] = determinize(
        grammarMixer(l)
    );

});
export const lexerRules = lista;
