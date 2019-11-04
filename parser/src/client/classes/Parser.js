
let Actions = {
    'shift': 0,
    'reduce': 1,
    'accept': 2,
    'goto': 2
};


class Parser {

    constructor (lexer, config) {
        this.lexer = lexer;
        this.table = config.table;
        this.ignoreTokens = config.ignoreTokens || [];
        this.states = config.states;
    }

    0 /* shift*/ (stateId) {
        const next = this.lexer.popToken();
        // console.log(next);
        this.stack.unshift(next);

        this._actualState = stateId;
    }

    1 /* reduce*/ (stateId) {
        this._reduce(stateId);
        this._actualState = this.actualState();
    }

    2 /* accept*/ (stateId) {
        this._reduce(stateId);
    }


    _reduce (stateId) {
        const reducer = this.states[stateId];

        const baseLen = reducer.base.length;
        const tree = [];
        for (let i = 0; i < baseLen; i++) {
            const a = this.stack.shift();
            tree.unshift(a);
        }
        if (reducer.action === undefined) {
            reducer.action = function (args) {
                return '---';
            };
        }
        const value = reducer.action(tree);

        this.stack.unshift({
            tokenType: reducer.create,
            tree,
            rules: value
        });
    }

    actualState () {
        let actualState = 0;

        for (let pos = this.stack.length - 1; pos > -1; pos--) {


            actualState = this.table[actualState][this.stack[pos].tokenType][1];
        }
        return actualState;
    }
    parse (text) {

        this.lexer.setInput(text);

        this.stack = [];

        this._actualState = this.actualState();

        while (true) {
            const token = this.lexer.readToken();

            if (this.ignoreTokens.indexOf(token.tokenType) !== -1) {
                this.lexer.popToken();
                continue;
            }

            if (this.table[this._actualState][token.tokenType]) {
                const nextAction = this.table[this._actualState][token.tokenType];
                // console.log(nextAction.t, nextAction[1])


                if(typeof(this[nextAction[0]]) !== 'function')
                {
                    debugger;
                }


                this[nextAction[0]](nextAction[1]);

                if (nextAction[0] === Actions.accept) {
                    break;
                }
            } else {
                console.log(`%c${
                    this.lexer.input.substring(this.lexer.nextToken.startPosition - 10, this.lexer.nextToken.startPosition)
                }%c${
                    this.lexer.input.substring(this.lexer.nextToken.startPosition, this.lexer.nextToken.toPos)
                }%c${
                    this.lexer.input.substring(this.lexer.nextToken.toPos, this.lexer.YYCURSOR + 10)}`,
                    
                    'background:#fff;color:#000', 'background:#f00;color:#fff', 'background:#fff;color:#000');
                    
                
                throw 'unexpeted ';
            }
        }
    }

}

export default Parser;
