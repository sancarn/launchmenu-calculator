import {createHighlightTokens, HighlightParser, highlightTags} from "@launchmenu/core";
import {Lexer} from "@launchmenu/core/build/textFields/syntax/HighlightParser";

const {tokens, tokenList} = createHighlightTokens({
    lBracket: {
        pattern: /\(/,
        tags: [highlightTags.bracket, highlightTags.left],
    },
    rBracket: {
        pattern: /\)/,
        tags: [highlightTags.bracket, highlightTags.right],
    },
    add: {pattern: /\+/, tags: [highlightTags.operator]},
    sub: {pattern: /\-/, tags: [highlightTags.operator]},
    mul: {pattern: /\*/, tags: [highlightTags.operator]},
    div: {pattern: /\//, tags: [highlightTags.operator]},
    pow: {pattern: /\^|\*\*/, tags: [highlightTags.operator]},
    factorial: {pattern: /\!/, tags: [highlightTags.operator]},
    paramSeperator: {pattern: /\,/, tags: [highlightTags.operator]},
    functionName: {pattern: /[a-zA-Z_]\w+/, tags: [highlightTags.operator]},
    value: {
        pattern: /[0-9]+(?:\.[0-9]+)?/,
        tags: [highlightTags.literal, highlightTags.number],
    },
    whiteSpace: {
        pattern: /\s+/,
        tags: [highlightTags.whiteSpace],
        group: Lexer.SKIPPED,
    },
});
tokens.mul.LONGER_ALT = tokens.pow; //assign longer_alt

//TODO: Move to helper library
var factorialCache: number[] = [];
function factorial(n: number): number {
    if (isNaN(n)) return 0;
    if (n == 0 || n == 1) return 1;
    if (factorialCache[n] > 0) return factorialCache[n];
    return (factorialCache[n] = factorial(n - 1) * n);
}

export default class MathInterpreter extends HighlightParser<number> {
    constructor() {
        super(tokenList);
        this.performSelfAnalysis();
    }
    public variables = {};
    public functions = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        atan2: Math.atan2,
        asinh: Math.asinh,
        acosh: Math.acosh,
        atanh: Math.atanh,
        cbrt: Math.cbrt,
        hypot: Math.hypot,
        round: Math.round,
        sign: Math.sign,
        min: Math.min,
        max: Math.max,
        ceil: Math.ceil,
        floor: Math.floor,
        abs: Math.abs,
        exp: Math.exp,
        ln: Math.log,
        log: Math.log,
        log10: Math.log10,
        rnd: Math.random,
        sum: (...args: number[]): number => args.reduce((a, b) => a + b),
        avg: (...args: number[]): number => {
            return args.reduce((a, b) => a + b) / args.length;
        },
    } as {[key: string]: any};

    public evaluate(query: string): string | undefined {
        var {errors, result} = super.execute(query);
        if (errors?.length) return;
        if (result) {
            return result.toString();
        }
    }

    // Note that by default the first defined rule becomes the start rule
    // (this can be change by passing a config to the constructor)
    protected expression = this.RULE("expression", () => {
        let result: number = this.SUBRULE(this.term);
        this.MANY(() => {
            const {tokenType} = this.OR([
                {ALT: () => this.CONSUME(tokens.add)},
                {ALT: () => this.CONSUME(tokens.sub)},
            ]);
            const value = this.SUBRULE2(this.term);
            result = tokenType == tokens.add ? result + value : result - value;
        });
        return result;
    });
    protected term = this.RULE("term", () => {
        let result = this.SUBRULE(this.powTerm);
        this.MANY(() => {
            const {tokenType} = this.OR([
                {ALT: () => this.CONSUME(tokens.mul)},
                {ALT: () => this.CONSUME(tokens.div)},
            ]);
            const value = this.SUBRULE2(this.powTerm);
            result = tokenType == tokens.mul ? result * value : result / value;
        });
        return result;
    });
    protected powTerm = this.RULE("powTerm", () => {
        let result = this.SUBRULE(this.factorialTerm);
        this.MANY(() => {
            this.CONSUME(tokens.pow);
            const value = this.SUBRULE2(this.factorialTerm);
            result = result ** value;
        });
        return result;
    });
    protected factorialTerm = this.RULE("factorialTerm", () => {
        let result = this.SUBRULE(this.factor);
        this.OPTION(() => {
            this.MANY(() => {
                this.CONSUME(tokens.factorial);
                result = factorial(result);
            });
        });
        return result;
    });
    protected params = this.RULE("params", () => {
        this.CONSUME(tokens.lBracket);
        let params: number[] = [];
        this.OPTION(() => {
            params.push(this.SUBRULE(this.expression));
            this.MANY(() => {
                this.CONSUME(tokens.paramSeperator);
                params.push(this.SUBRULE2(this.expression));
            });
        });
        this.CONSUME(tokens.rBracket);
        return params;
    });
    protected factor = this.RULE("factor", () =>
        this.OR([
            {
                ALT: () => {
                    let functionName = this.CONSUME(tokens.functionName).image.toString();
                    let params = this.SUBRULE(this.params);
                    if (typeof this.functions[functionName] == "function") {
                        return this.functions[functionName](...params);
                    }
                },
            },
            {
                ALT: () => {
                    this.CONSUME2(tokens.lBracket);
                    const value = this.SUBRULE3(this.expression);
                    this.CONSUME2(tokens.rBracket);
                    return value;
                },
            },
            {
                ALT: () => {
                    const {image} = this.CONSUME(tokens.value);
                    return parseFloat(image); //
                },
            },
        ])
    );
}

// const parser = new MathInterpreter();
// const res = parser.execute("1*5!/10^3");
// if (res.result) alert(res.result);
// else alert("Parsing error!");
