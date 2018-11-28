export const parserRules = {
    start: 'G',

    'precedence': [],
    states: {

        G: {
            rules: [{
                rule: ['startx'],
                action: function (args) {
                    return args[0].rules;
                }
            }]
        },
        startx: {
            rules: [{
                rule: ['RE'],
                action: function (args) {
                    return args[0].rules;
                }
            }]
        },

        RE: {
            rules: [{
                rule: ['or'],
                action: function (args) {
                    return args[0].rules;
                }
            }, {
                rule: ['simpleRE'],
                action: function (args) {
                    return args[0].rules;
                }
            }]
        },

        or: {
            rules: [{
                rule: ['RE', '|', 'simpleRE'],
                action: function (args) {

                    return {
                        'tokenType': 'or',
                        rules: [args[0].rules, args[2].rules]
                    };
                }
            }]
        },

        simpleRE: {
            rules: [{
                rule: ['concatenation'],
                action: function (args) {
                    return {
                        'tokenType': 'concat',
                        rules: [args[0].rules]
                    };
                }
            }, {
                rule: ['basicRE'],
                action: function (args) {

                    return {
                        'tokenType': 'concat',

                        rules: [args[0].rules]
                    };
                }
            }]
        },

        concatenation: {
            rules: [{
                rule: ['simpleRE', 'basicRE'],
                action: function (args) {

                    return {
                        'tokenType': 'concat',

                        rules: [args[0].rules, args[1].rules]
                    };

                }
            }]
        },

        basicRE: {
            rules: [

                {
                    rule: ['star'],
                    action: function (args) {

                        return args[0].rules;
                    }

                }, {
                    rule: ['plus'],
                    action: function (args) {

                        return args[0].rules;
                    }

                }, {
                    rule: ['optional'],
                    action: function (args) {
                        return args[0].rules;
                    }

                },

                {
                    rule: ['elementaryRE'],
                    action: function (args) {

                        return args[0].rules;
                    }
                }

            ]
        },

        star: {
            rules: [{
                rule: ['elementaryRE', '*'],
                action: function (args) {

                    return {
                        'tokenType': 'star',
                        rules: [args[0].rules]
                    };
                }
            }]
        },

        plus: {
            rules: [{
                rule: ['elementaryRE', '+'],
                action: function (args) {

                    return {
                        'tokenType': 'plus',
                        rules: [args[0].rules]
                    };
                }
            }]
        },

        optional: {
            rules: [{
                rule: ['elementaryRE', '?'],
                action: function (args) {

                    return {
                        'tokenType': 'optional',
                        rules: [args[0].rules]
                    };
                }
            }]
        },

        elementaryRE: {
            rules: [{
                rule: ['group'],
                action: function (args) {
                    return args[0].rules;
                }
            },

            {
                rule: ['.'],
                action: function (args) {
                    return {
                        'tokenType': '.',
                        rules: args[0].content
                    };
                }
            },

            {
                rule: ['$'],
                action: function (args) {
                    return {
                        'tokenType': '$',
                        rules: args[0].content
                    };
                }
            }, {
                rule: ['char'],
                action: function (args) {

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
                rule: ['metachar'],
                action: function (args) {

                    return {
                        'tokenType': 'char',
                        rules: ':' // args[0].content,
                    };
                }
            }, {
                rule: ['range'],
                action: function (args) {
                    return args[0].rules;
                }
            }
            ]
        },

        group: {
            rules: [{
                rule: ['(', 'RE', ')'],
                action: function (args) {
                    return args[1].rules;
                }
            }

            ]
        },

        range: {
            rules: [{
                rule: ['[', 'char', '-', 'char', ']'],
                action: function (args) {
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

    }
};
