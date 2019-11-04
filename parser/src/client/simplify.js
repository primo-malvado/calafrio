
import Parser from './classes/Parser';
import Lexer from './classes/Lexer';
import { createParser } from './classes/GenerateLalrParser';

import { lexerRules } from './rules/calc/lexRules';
import { parserRules } from './rules/calc/parserRules';

const parserTable = createParser(parserRules);

for (let i in lexerRules) {
    let item = lexerRules[i];

    for (let j in item.endMap) {
        let item2 = item.endMap[j];
        delete (item2.tokenType);
        delete (item2.priority);
    }
}


let lexer = new Lexer(lexerRules, false);

let parser = new Parser(lexer, parserTable);


parser.parse('3 -65 / 17  -5 * ( 5 / 12 ) * 3');
let ast = parser.stack[0].rules;


function mdc (a, b){
    let resto = a%b;
    if(resto === 0){
        return b;
    }else{

        return mdc(b, resto);
    }


}


function simplify (tree){
    switch(tree.type){

    case 'number':
        return false;
        break;

    case 'sum':

        if(tree.child[0].type === 'number' && tree.child[1].type === 'number'){

            tree.type = 'number';
            tree.child = [  tree.child[0].child[0] + tree.child[1].child[0]                 ];
            return true;

        }


        if(tree.child[0].type === 'number' && tree.child[1].type === 'sum' )
        {


            if(tree.child[1].child[0].type === 'number' )
            {

                tree.child  = [ tree.child[0].child[0] +tree.child[1].child[0].child[0], tree.child[1].child[1]];

                return true;
            }

            if(tree.child[1].child[1].type === 'number' )
            {

                tree.child  = [ tree.child[0].child[0] +tree.child[1].child[1].child[0], tree.child[1].child[0]];

                return true;
            }


        }


        if(tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number' && tree.child[1].type === 'number')
        {

            tree.type = '/';
            tree.child= [
                {type: 'number', child: [

                    tree.child[0].child[0].child[0] + tree.child[1].child[0] * tree.child[0].child[1].child[0]


                ]},
                tree.child[0].child[1]
            ];

            return true;
        }


        if(tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number'
                && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number'

        )
        {


            tree.type =  '/';
            tree.child= [
                {type: 'number', child: [

                    tree.child[0].child[0].child[0]  * tree.child[1].child[1].child[0] +
                    tree.child[1].child[0].child[0]  * tree.child[0].child[1].child[0]

                ]},
                {type: 'number', child: [

                    tree.child[0].child[1].child[0] * tree.child[1].child[1].child[0]


                ]}
            ];
            return true;
        }


        break;


    case '-':

        if(tree.child[0].type === 'number' && tree.child[1].type === 'number')
        {


            tree.type = 'number';
            tree.child  = [  tree.child[0].child[0] - tree.child[1].child[0]                 ];

            return true;


        }


        if(tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number'
                && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number'

        )
        {

            tree.type = '/';
            tree.child = [
                {type: 'number', child: [

                    tree.child[0].child[0].child[0]  * tree.child[1].child[1].child[0] -
                    tree.child[1].child[0].child[0]  * tree.child[0].child[1].child[0]

                ]},
                {type: 'number', child: [

                    tree.child[0].child[1].child[0] * tree.child[1].child[1].child[0]


                ]}
            ];

            return true;
        }


        //    3  - (2 /3)

        if( tree.child[0].type === 'number' &&  tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number')
        {

            tree.type= '/';
            tree.child = [
                {type: 'number', child: [

                    tree.child[0].child[0] * tree.child[1].child[1].child[0] - tree.child[1].child[0].child[0]


                ]},
                tree.child[1].child[1]
            ];
            return true;
        }


        // (23 / 42 )  - 23
        if( tree.child[1].type === 'number' &&  tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number')
        {

            tree.type= '/';
            tree.child = [
                {type: 'number', child: [

                    tree.child[0].child[0].child[0] - tree.child[1].child[0] * tree.child[0].child[1].child[0]


                ]},
                tree.child[0].child[1]
            ];
            return true;
        }

        break;

    case 'product':

        if(tree.child[0].type === 'number' && tree.child[1].type === 'number')
        {
            tree.type = 'number';
            tree.child = [  tree.child[0].child[0] * tree.child[1].child[0]                 ];
            return true;

        }

        if(tree.child[0].type === 'product' && tree.child[0].child[0].type === 'number' && tree.child[1].type === 'number')
        {


            tree.type = 'product';
            tree.child =  [
                {type: 'number', child: [

                    tree.child[0].child[0].child[0] * tree.child[1].child[0]
                ]},
                tree.child[0].child[1]
            ];
            return true;
        }


        if(tree.child[0].type === 'number' && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' ){

            tree.type = '/';
            tree.child = [
                {type: 'number', child: [

                    tree.child[0].child[0] *   tree.child[1].child[0].child[0]
                ]},
                tree.child[1].child[1]
            ];
            return false;
        }


        if(tree.child[0].type === '/' && tree.child[0].child[0].type === 'number'  && tree.child[1].type === 'number' ){

            tree.type = '/';
            tree.child = [
                {type: 'number', child: [

                    tree.child[1].child[0] *   tree.child[0].child[0].child[0]
                ]},
                tree.child[0].child[1]
            ];
            return true;
        }


        if(tree.child[0].type === '/' && tree.child[0].child[0].type === 'number' && tree.child[0].child[1].type === 'number'
                && tree.child[1].type === '/' && tree.child[1].child[0].type === 'number' && tree.child[1].child[1].type === 'number'

        )
        {

            tree.type = '/';
            tree.child = [
                {type: 'number', child: [

                    tree.child[0].child[0].child[0]  * tree.child[1].child[0].child[0]

                ]},
                {type: 'number', child: [

                    tree.child[0].child[1].child[0] * tree.child[1].child[1].child[0]


                ]}
            ] ;
            return true;
        }


        break;


    case '/':

        if(tree.child[0].type === 'number' && tree.child[1].type === 'number')
        {

            let d = mdc (Math.max(tree.child[0].child[0], tree.child[1].child[0]), Math.min(tree.child[0].child[0], tree.child[1].child[0]));


            if(d === 1){
                return false;
            }

            if(d === tree.child[1].child[0] ){
                tree.type = 'number';
                tree.child = [

                    tree.child[0].child[0]/d
                ];
                return true;
            }

            tree.child = [  {type: 'number', child: [ tree.child[0].child[0]/d]},  {type: 'number', child: [tree.child[1].child[0] /d  ]}               ];
            return true;
        }
        break;


    }

    let changed = false;
    // console.log(tree);
    for(let i = 0; i<  tree.child.length; i++){
        changed = changed ||  simplify(tree.child[i]);

    }

    return changed;

}


function printExp (tree){
    switch(tree.type){
    case 'number':
        return tree.child[0];
        break;


    case 'sum':

        return '(' + printExp (tree.child[0]) + ' + ' +printExp (tree.child[1]) + ' ) ' ;
        break;


    case '-':


        return '(' + printExp (tree.child[0]) + ' - ' +printExp (tree.child[1]) + ' ) ' ;
        break;

    case 'product':

        return '(' + printExp (tree.child[0]) + ' * ' +printExp (tree.child[1]) + ' ) ' ;
        break;


    case '/':
        return '(' + printExp (tree.child[0]) + ' / ' +printExp (tree.child[1]) + ' ) ' ;
        break;


    }


    for(let i = 0; i<  tree.child.length; i++){
        tree.child[i] = simplify(tree.child[i]);
    }

    return tree;

}


console.log(printExp(ast));

while(simplify (ast)){
    console.log(printExp(ast));
}

