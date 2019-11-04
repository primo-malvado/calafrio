/*
let Actions = {
    'shift': 0,
    'reduce': 1,
    'accept': 2,
    'goto': 2
};
*/


export const config = {
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
            },
            {
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
            },
            {
                'from': '11',
                '_ft_': '$',
                '_tt_': '$',
                'to': '14'
            },
            {
                'from': '11',
                '_ft_': 'r',
                '_tt_': 't',
                'to': '14'
            },
            {
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
            },
            {
                'from': '0',
                '_ft_': '!',
                '_tt_': '#',
                'to': '14'
            },
            {
                'from': '0',
                '_ft_': '@',
                '_tt_': 'Z',
                'to': '14'
            },
            {
                'from': '0',
                '_ft_': '%',
                '_tt_': '\'',
                'to': '14'
            },
            {
                'from': '0',
                '_ft_': '/',
                '_tt_': '>',
                'to': '14'
            }],
            endMap: {
                1: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '?'
                        };
                    }
                },
                2: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '['
                        };
                    }
                },
                3: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '.'
                        };
                    }
                },
                4: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: ']'
                        };
                    }
                },
                5: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: ')'
                        };
                    }
                },
                6: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '('
                        };
                    }
                },
                7: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '|'
                        };
                    }
                },
                8: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '*'
                        };
                    }
                },
                9: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '+'
                        };
                    }
                },
                10: {
                    parseFunction: function parseFunction (lexer) {
                        return {
                            tokenType: '-'
                        };
                    }
                },
                14: {
                    parseFunction: function parseFunction (lexer) {

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
            action: function action (args) {
                return args[0].rules;
            }
        }, {
            create: 'startx',
            base: ['RE'],
            action: function action (args) {
                return args[0].rules;
            }
        }, {
            create: 'RE',
            base: ['or'],
            action: function action (args) {
                return args[0].rules;
            }
        }, {
            create: 'RE',
            base: ['simpleRE'],
            action: function action (args) {
                return args[0].rules;
            }
        }, {
            create: 'or',
            base: ['RE', '|', 'simpleRE'],
            action: function action (args) {

                return {
                    'tokenType': 'or',
                    rules: [args[0].rules, args[2].rules]
                };
            }
        }, {
            create: 'simpleRE',
            base: ['concatenation'],
            action: function action (args) {
                return {
                    'tokenType': 'concat',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'simpleRE',
            base: ['basicRE'],
            action: function action (args) {

                return {
                    'tokenType': 'concat',

                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'concatenation',
            base: ['simpleRE', 'basicRE'],
            action: function action (args) {

                return {
                    'tokenType': 'concat',

                    rules: [args[0].rules, args[1].rules]
                };
            }
        }, {
            create: 'basicRE',
            base: ['star'],
            action: function action (args) {

                return args[0].rules;
            }
        }, {
            create: 'basicRE',
            base: ['plus'],
            action: function action (args) {

                return args[0].rules;
            }
        }, {
            create: 'basicRE',
            base: ['optional'],
            action: function action (args) {
                return args[0].rules;
            }
        }, {
            create: 'basicRE',
            base: ['elementaryRE'],
            action: function action (args) {

                return args[0].rules;
            }
        }, {
            create: 'star',
            base: ['elementaryRE', '*'],
            action: function action (args) {

                return {
                    'tokenType': 'star',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'plus',
            base: ['elementaryRE', '+'],
            action: function action (args) {

                return {
                    'tokenType': 'plus',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'optional',
            base: ['elementaryRE', '?'],
            action: function action (args) {

                return {
                    'tokenType': 'optional',
                    rules: [args[0].rules]
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['group'],
            action: function action (args) {
                return args[0].rules;
            }
        }, {
            create: 'elementaryRE',
            base: ['.'],
            action: function action (args) {
                return {
                    'tokenType': '.',
                    rules: args[0].content
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['$'],
            action: function action (args) {
                return {
                    'tokenType': '$',
                    rules: args[0].content
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['char'],
            action: function action (args) {

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
            action: function action (args) {

                return {
                    'tokenType': 'char',
                    rules: ':' // args[0].content,
                };
            }
        }, {
            create: 'elementaryRE',
            base: ['range'],
            action: function action (args) {
                return args[0].rules;

            }
        }, {
            create: 'group',
            base: ['(', 'RE', ')'],
            action: function action (args) {
                return args[1].rules;
            }
        }, {
            create: 'range',
            base: ['[', 'char', '-', 'char', ']'],
            action: function action (args) {
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
