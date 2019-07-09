import Parser from './classes/Parser';
import Lexer from './classes/Lexer';
import { createParser } from './classes/GenerateLalrParser';

import { lexerRules } from './rules/calc/lexRules';
import { parserRules } from './rules/calc/parserRules';

var text = "3 -65 / 17  - 5 * ( 5 / 12 ) * 3 ";


const parserTable = createParser(parserRules);

let lexer = new Lexer(lexerRules, false);

let parser = new Parser(lexer, parserTable);


parser.parse(text);
let a = parser.stack[0].rules;
console.log('resultado', JSON.stringify(a));

 
 

import { dotRenderer } from './classes/StateMachineDependency/DotRenderer';
import RegexToNfa from './classes/RegexToNfa';

import { minimize } from './classes/StateMachineDependency/Minimizer';
import { determinize } from './classes/StateMachineDependency/Determinizer';


// let sm = RegexToDfa('(\\.[0-9]+|[0-9]+(\\.[0-9]*)?)');

//let regex = '(1234)|(1c)|(12r)';
let regex = '(\\.[0-9]+|[0-9]+(\\.[0-9]*)?)';


let sm = RegexToNfa(regex);
dotRenderer(sm);


let det = determinize(sm);
dotRenderer(det);


let min = minimize(det);
dotRenderer(min);
 