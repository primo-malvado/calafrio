export default {
    "tokens": [
        "G",
        "expr",
        "NUMBER",
        "SQRT",
        "(",
        ")",
        "SIN",
        "COS",
        "*",
        "/",
        "+",
        "-",
        "^"
    ],
    "states": [{
            "create": "G",
            "base": [
                "expr"
            ],
            "action": function(args) {
                return args[0].rules;
            }
        },
        {
            "create": "expr",
            "base": [
                "NUMBER"
            ],
            "action": function(args) {
                return {
                    type: 'number',
                    child: [args[0].content] // value: args[0].content

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "SQRT",
                "(",
                "expr",
                ")"
            ],
            "action": function(args) {
                return {
                    type: 'SQRT',
                    child: [args[2].rules] // value: Math.sqrt(args[2].rules.value)

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "SIN",
                "(",
                "expr",
                ")"
            ],
            "action": function(args) {
                return {
                    type: 'SIN',
                    child: [args[2].rules] // value: Math.sin(args[2].rules.value)

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "COS","(","expr",")"
            ],
            "action": function(args) {
                return {
                    type: 'COS',
                    child: [args[2].rules] // value: Math.cos(args[2].rules.value)

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "expr",
                "*",
                "expr"
            ],
            "action": function(args) {
                return {
                    type: 'product',
                    child: [args[0].rules, args[2].rules] // value: args[0].rules.value * args[2].rules.value

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "expr",
                "/",
                "expr"
            ],
            "action": function(args) {
                return {
                    type: '/',
                    child: [args[0].rules, args[2].rules] // value: args[0].rules.value / args[2].rules.value

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "expr",
                "+",
                "expr"
            ],
            "action": function(args) {
                return {
                    type: 'sum',
                    child: [args[0].rules, args[2].rules] // value: args[0].rules.value + args[2].rules.value

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "expr",
                "-",
                "expr"
            ],
            "action": function(args) {
                return {
                    type: '-',
                    child: [args[0].rules, args[2].rules] // value: args[0].rules.value - args[2].rules.value

                };
            }
        },
        {
            "create": "expr",
            "base": [
                "expr",
                "^",
                "expr"
            ],
            "action": function(args) {
                return {
                    type: 'power',
                    child: [args[0].rules, args[2].rules]
                };
            }
        },
        {
            "create": "expr",
            "base": [
                "(",
                "expr",
                ")"
            ],
            "action": function(args) {
                return args[1].rules;
            }
        },
        {
            "create": "expr",
            "base": [
                "-",
                "expr"
            ],
            "action": function(args) {
                return {
                    type: 'negative',
                    child: [args[1].rules]
                };
            }
        }
    ],
    "ignoreTokens": [
        "WHITESPACE"
    ],
    "table": {
        "0": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 1]
        },
        "1": {
            "eof": [2, 0],
            "*": [0, 2],
            "/": [0, 8],
            "+": [0, 13],
            "-": [0, 18],
            "^": [0, 20]
        },
        "2": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 29]
        },
        "3": {
            "eof": [1, 1],
            ")": [1, 1],
            "*": [1, 1],
            "/": [1, 1],
            "+": [1, 1],
            "-": [1, 1],
            "^": [1, 1]
        },
        "4": {
            "(": [0, 5]
        },
        "5": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 6]
        },
        "6": {
            ")": [0, 7],
            "*": [0, 2],
            "/": [0, 8],
            "+": [0, 13],
            "-": [0, 18],
            "^": [0, 20]
        },
        "7": {
            "eof": [1, 2],
            ")": [1, 2],
            "*": [1, 2],
            "/": [1, 2],
            "+": [1, 2],
            "-": [1, 2],
            "^": [1, 2]
        },
        "8": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 28]
        },
        "9": {
            "(": [0, 10]
        },
        "10": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 11]
        },
        "11": {
            ")": [0, 12],
            "*": [0, 2],
            "/": [0, 8],
            "+": [0, 13],
            "-": [0, 18],
            "^": [0, 20]
        },
        "12": {
            "eof": [1, 3],
            ")": [1, 3],
            "*": [1, 3],
            "/": [1, 3],
            "+": [1, 3],
            "-": [1, 3],
            "^": [1, 3]
        },
        "13": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 27]
        },
        "14": {
            "(": [0, 15]
        },
        "15": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 16]
        },
        "16": {
            ")": [0, 17],
            "*": [0, 2],
            "/": [0, 8],
            "+": [0, 13],
            "-": [0, 18],
            "^": [0, 20]
        },
        "17": {
            "eof": [1, 4],
            ")": [1, 4],
            "*": [1, 4],
            "/": [1, 4],
            "+": [1, 4],
            "-": [1, 4],
            "^": [1, 4]
        },
        "18": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 19]
        },
        "19": {
            "eof": [1, 8],
            ")": [1, 8],
            "*": [0, 2],
            "/": [0, 8],
            "+": [1, 8],
            "-": [1, 8],
            "^": [0, 20]
        },
        "20": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 21]
        },
        "21": {
            "eof": [1, 9],
            ")": [1, 9],
            "*": [1, 9],
            "/": [1, 9],
            "+": [1, 9],
            "-": [1, 9],
            "^": [1, 9]
        },
        "22": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 23]
        },
        "23": {
            ")": [0, 24],
            "*": [0, 2],
            "/": [0, 8],
            "+": [0, 13],
            "-": [0, 18],
            "^": [0, 20]
        },
        "24": {
            "eof": [1, 10],
            ")": [1, 10],
            "*": [1, 10],
            "/": [1, 10],
            "+": [1, 10],
            "-": [1, 10],
            "^": [1, 10]
        },
        "25": {
            "NUMBER": [0, 3],
            "SQRT": [0, 4],
            "(": [0, 22],
            "SIN": [0, 9],
            "COS": [0, 14],
            "-": [0, 25],
            "expr": [2, 26]
        },
        "26": {
            "eof": [1, 11],
            ")": [1, 11],
            "*": [1, 11],
            "/": [1, 11],
            "+": [1, 11],
            "-": [1, 11],
            "^": [1, 11]
        },
        "27": {
            "eof": [1, 7],
            ")": [1, 7],
            "*": [0, 2],
            "/": [0, 8],
            "+": [1, 7],
            "-": [1, 7],
            "^": [0, 20]
        },
        "28": {
            "eof": [1, 6],
            ")": [1, 6],
            "*": [1, 6],
            "/": [1, 6],
            "+": [1, 6],
            "-": [1, 6],
            "^": [0, 20]
        },
        "29": {
            "eof": [1, 5],
            ")": [1, 5],
            "*": [1, 5],
            "/": [1, 5],
            "+": [1, 5],
            "-": [1, 5],
            "^": [0, 20]
        }
    }
}