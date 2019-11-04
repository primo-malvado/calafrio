export const lexerRules = {
    "INITIAL": {
        "table": [
            {"_ft_": "0", "_tt_": "9", "from": "0", "to": "1"},
            {
                "_ft_": ".",
                "_tt_": ".",
                "from": "1",
                "to": "2"
            },
            {
                "_ft_": "0",
                "_tt_": "9",
                "from": "2",
                "to": "2"
            },
            {
                "_ft_": "0",
                "_tt_": "9",
                "from": "1",
                "to": "1"
            },
            {
                "_ft_": ",",
                "_tt_": ",",
                "from": "0",
                "to": "3"
            },
            {
                "_ft_": "p",
                "_tt_": "p",
                "from": "0",
                "to": "4"
            },
            {
                "_ft_": "i",
                "_tt_": "i",
                "from": "4",
                "to": "5"
            },
            {
                "_ft_": "s",
                "_tt_": "s",
                "from": "0",
                "to": "6"
            },
            {
                "_ft_": "q",
                "_tt_": "q",
                "from": "6",
                "to": "7"
            },
            {
                "_ft_": "r",
                "_tt_": "r",
                "from": "7",
                "to": "8"
            },
            {
                "_ft_": "t",
                "_tt_": "t",
                "from": "8",
                "to": "9"
            },
            {
                "_ft_": "i",
                "_tt_": "i",
                "from": "6",
                "to": "10"
            },
            {
                "_ft_": "n",
                "_tt_": "n",
                "from": "10",
                "to": "11"
            },
            {
                "_ft_": "c",
                "_tt_": "c",
                "from": "0",
                "to": "12"
            },
            {
                "_ft_": "o",
                "_tt_": "o",
                "from": "12",
                "to": "13"
            },
            {
                "_ft_": "s",
                "_tt_": "s",
                "from": "13",
                "to": "14"
            },
            {
                "_ft_": "(",
                "_tt_": "(",
                "from": "0",
                "to": "15"
            },
            {
                "_ft_": ")",
                "_tt_": ")",
                "from": "0",
                "to": "16"
            },
            {
                "_ft_": "+",
                "_tt_": "+",
                "from": "0",
                "to": "17"
            },
            {
                "_ft_": "^",
                "_tt_": "^",
                "from": "0",
                "to": "18"
            },
            {
                "_ft_": "-",
                "_tt_": "-",
                "from": "0",
                "to": "19"
            },
            {
                "_ft_": "*",
                "_tt_": "*",
                "from": "0",
                "to": "20"
            },
            {
                "_ft_": "/",
                "_tt_": "/",
                "from": "0",
                "to": "21"
            },
            {
                "_ft_": " ",
                "_tt_": " ",
                "from": "0",
                "to": "22"
            },
            {
                "_ft_": " ",
                "_tt_": " ",
                "from": "22",
                "to": "22"
            },
            {
                "_ft_": "\t",
                "_tt_": "\t",
                "from": "22",
                "to": "22"
            },
            {
                "_ft_": "\r",
                "_tt_": "\r",
                "from": "22",
                "to": "22"
            },
            {
                "_ft_": "\n",
                "_tt_": "\n",
                "from": "22",
                "to": "22"
            },
            {
                "_ft_": "\t",
                "_tt_": "\t",
                "from": "0",
                "to": "22"
            },
            {
                "_ft_": "\r",
                "_tt_": "\r",
                "from": "0",
                "to": "22"
            },
            {
                "_ft_": "\n",
                "_tt_": "\n",
                "from": "0",
                "to": "22"
            }
        ],
        "start": [
            "0"
        ],/*
        "end": [
            "1",
            "2",
            "3",
            "5",
            "9",
            "11",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22"
        ],*/
        "endMap": {
            "1": {
                "parseFunction": function(lexer) {
                    return {
                        content: parseFloat(lexer.yytext),
                        tokenType: 'NUMBER'
                    };
                }
            },
            "2": {
                "parseFunction": function(lexer) {
                    return {
                        content: parseFloat(lexer.yytext),
                        tokenType: 'NUMBER'
                    };
                }
            },
            "3": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: lexer.yytext
                    };
                }
            },
            "5": {
                "parseFunction": function(lexer) {
                    return {

                        content: 'PI',
                        tokenType: 'CONST'
                    };
                }
            },
            "9": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: 'SQRT'
                    };
                }
            },
            "11": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: 'SIN'
                    };
                }
            },
            "14": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: 'COS'
                    };
                }
            },
            "15": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: '('
                    };
                }
            },
            "16": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: ')'
                    };
                }
            },
            "17": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: '+'
                    };
                }
            },
            "18": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: '^'
                    };
                }
            },
            "19": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: '-'
                    };
                }
            },
            "20": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: '*'
                    };
                }
            },
            "21": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: lexer.yytext
                    };
                }
            },
            "22": {
                "parseFunction": function(lexer) {
                    return {
                        tokenType: 'WHITESPACE'
                    };
                }
            }
        }
    }
}