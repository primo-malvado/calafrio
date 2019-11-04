class Lexer {
    constructor (grammar) {
        this.states = ['INITIAL'];
        this.YYCURSOR = 0;
        this.grammar = grammar;
        this.nextToken = null;
    }

    setInput (exp) {
        this.input = exp;
        this.states = ['INITIAL'];
        this.YYCURSOR = 0;
        this.nextToken = null;
    }

    readToken () {
        if (this.nextToken === null) {
            this.nextToken = this.parse();
        }

        return this.nextToken;
    }


    beginState (state) {
        this.states.unshift(state);
    }

    parse () {
        const startPosition = this.YYCURSOR;

        this.yytext = '';
        let stateId = '0';

        let buffer = null;

        this.YYLIMIT = this.input.length;

        while (this.YYCURSOR < this.YYLIMIT) {
            const current_read = this.input.charAt(this.YYCURSOR);

            const states = this.grammar[this.states[0]].table.filter(jump => jump.from === stateId && jump._ft_ <= current_read && jump._tt_ >= current_read);


            if (states.length > 0) {
                this.YYCURSOR++;
                this.yytext += current_read;
                stateId = states[0].to;

                if (this.grammar[this.states[0]].endMap[stateId] !== undefined) {
                    const tokenType = this.grammar[this.states[0]].endMap[stateId].tokenType;


                    buffer = {
                        tokenType,
                        parseFunction: this.grammar[this.states[0]].endMap[stateId].parseFunction,
                        content: this.yytext,
                        startPosition,
                        pos: this.YYCURSOR
                    };
                }
            } else if (buffer !== null) {
                if (buffer.parseFunction) {
                    const t = buffer.parseFunction(this);
                    t.startPosition = startPosition;
                    t.toPos = buffer.pos;

                    return t;
                }
                return buffer;
            } else {
                console.log(
                    `%c${this.input.substring(startPosition - 10, startPosition)
                    }%c${this.input.substring(startPosition, this.YYCURSOR + 1)
                    }%c${this.input.substring(this.YYCURSOR + 1, this.YYCURSOR + 10)}`,
                    'background:#fff;color:#000', 'background:#f00;color:#fff', 'background:#fff;color:#000');

                throw 'lexer unexpeted ';
            }
        }

        if (buffer !== null) {
            if (buffer.parseFunction) {
                const tx = buffer.parseFunction(this);
                tx.startPosition = startPosition;
                tx.toPos = buffer.pos;

                return tx;
            }
            return buffer;
        }

        return {
            tokenType: 'eof'
        };
    }

    popToken () {
        const token = this.readToken();
        this.nextToken = null;
        return token;
    }

}

export default Lexer;
