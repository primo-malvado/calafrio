export const parserRules = {
    start: 'G',
    ignoreTokens: ['WHITESPACE'],
    'precedence': [],
    states: {

        G: {
            rules: [{
                rule: ['express_list'],
                action: function (args) {
                    return args[0].rules;
                }
            }]
        },
        express_list: {
            rules: [
                {
                    rule: [],
                    action: function (args) {
                        return [];

                    }
                },
                {
                    rule: ['express_list', 'express'],
                    action: function (args) {
                        args[0].rules.push(args[1].rules);
                        return args[0].rules;

                    }
                }

            ]
        },

        express: {
            rules: [{
                rule: ['COMMENT'],
                action: function (args) {
                    return args[0].content;
                }
            }]
        }
    }
};
