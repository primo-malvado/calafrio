import Parser from './classes/Parser';
import Lexer from './classes/Lexer';


/*
//dev
import { createParser } from './classes/GenerateLalrParser';
import { lexerRules } from './rules/calc/lexRules';
import { parserRules } from './rules/calc/parserRules';
const parserTable = createParser(parserRules);
*/

//prod
import { lexerRules } from './rules/calc/dist/lexRules';
import parserTable from './rules/calc/dist/parser';
 


var text = "3 + 2 ";
let lexer = new Lexer(lexerRules);

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
 