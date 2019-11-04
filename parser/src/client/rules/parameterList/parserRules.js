
export const parserRules = {
    start: 'G',
    'precedence': [],
    ignoreTokens: ['WHITESPACE'],
    states: {
        G: {
            rules: [

                {
                    rule: ['(', 'parameter_list', ')'],
                    action: function (args) {

                        return args[1].rules;
                    }
                }

            ]
        },

        parameter_list: {
            rules: [

                {
                    rule: ['non_empty_parameter_list'],
                    action: function (args) {

                        return {
                            type: 'parameter_list',
                            child: args[0].rules

                        };
                    }
                }, {
                    rule: [],
                    action: function (args) {

                        return {
                            type: 'parameter_list',
                            child: []

                        };

                    }
                }

            ]
        },

        non_empty_parameter_list: {
            rules: [

                {
                    rule: ['parameter'],
                    action: function (args) {

                        return [args[0].rules];

                    }
                }, {
                    rule: ['non_empty_parameter_list', ',', 'parameter'],
                    action: function (args) {

                        args[0].rules.push(args[2].rules);
                        return args[0].rules;

                    }
                }

            ]
        },

        parameter: {
            rules: [

                {
                    rule: ['type', 'IDENTIFIER'],
                    action: function (args) {

                        return {

                            type: 'parameter',
                            child: [
                                args[0].rules,
                                args[1]

                            ]

                        };
                    }
                }

            ]
        },

        type: {
            rules: [

                {
                    rule: ['TYPE'],
                    action: function (args) {

                        return {
                            value: args[0].content,
                            type: 'TYPE'

                        };
                    }
                },

                {
                    rule: [],
                    action: function (args) {

                        return {

                            type: 'EMPTYTYPE'

                        };
                    }
                }

            ]
        }

    }
};
