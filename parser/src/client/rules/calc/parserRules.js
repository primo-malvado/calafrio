
export const parserRules = {
    start: 'G',
    ignoreTokens: ['WHITESPACE'],
    'precedence': [

        {
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
        }
    ],
    states: {
        G: {
            rules: [

                {
                    rule: ['expr'],
                    action: function (args) {

                        return args[0].rules;
                    }
                }

            ]
        },

        expr: {
            rules: [

                {
                    rule: ['NUMBER'],
                    action: function (args) {

                        return {

                            type: 'number',
                            child: [args[0].content]

                            // value: args[0].content
                        };
                    }
                },

                {
                    rule: ['SQRT', '(', 'expr', ')'],
                    action: function (args) {
                        return {

                            type: 'SQRT',
                            child: [args[2].rules]
                            // value: Math.sqrt(args[2].rules.value)
                        };

                    }
                },

                {
                    rule: ['SIN', '(', 'expr', ')'],
                    action: function (args) {
                        return {

                            type: 'SIN',
                            child: [args[2].rules]
                            // value: Math.sin(args[2].rules.value)
                        };

                    }
                },

                {
                    rule: ['COS', '(', 'expr', ')'],
                    action: function (args) {
                        return {

                            type: 'COS',
                            child: [args[2].rules]
                            // value: Math.cos(args[2].rules.value)
                        };

                    }
                },

                {
                    rule: ['expr', '*', 'expr'],
                    action: function (args) {
                        return {

                            type: 'product',
                            child: [args[0].rules, args[2].rules]
                            // value: args[0].rules.value * args[2].rules.value
                        };

                    }
                },

                {
                    rule: ['expr', '/', 'expr'],
                    action: function (args) {
                        return {

                            type: '/',
                            child: [args[0].rules, args[2].rules]

                            // value: args[0].rules.value / args[2].rules.value
                        };

                    }
                },

                {
                    rule: ['expr', '+', 'expr'],
                    action: function (args) {

                        return {

                            type: 'sum',
                            child: [args[0].rules, args[2].rules]

                            // value: args[0].rules.value + args[2].rules.value
                        };

                    }
                },

                {
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
                },

                {
                    rule: ['(', 'expr', ')'],
                    action: function (args) {
                        return args[1].rules ;
                    }
                },

                {
                    rule: ['-', 'expr'],
                    prec: 'UMINUS',
                    action: function (args) {

                        return {
                            type: 'negative',
                            child: [args[1].rules]
                        };
                    }
                }

            ]
        }
    }
};
