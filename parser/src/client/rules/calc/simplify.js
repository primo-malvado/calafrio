let ast;
ast = {'type':'sum', 'child':[{'type':'sum', 'child':[{'type':'-', 'child':[{'type':'-', 'child':[{'type':'number', 'child':[3]}, {'type':'product', 'child':[{'type':'number', 'child':[6]}, {'type':'number', 'child':[6]}]}]}, {'type':'number', 'child':[69]}]}, {'type':'/', 'child':[{'type':'number', 'child':[42]}, {'type':'number', 'child':[87]}]}]}, {'type':'product', 'child':[{'type':'product', 'child':[{'type':'/', 'child':[{'type':'number', 'child':[5]}, {'type':'-', 'child':[{'type':'number', 'child':[17]}, {'type':'number', 'child':[5]}]}]}, {'type':'sum', 'child':[{'type':'sum', 'child':[{'type':'/', 'child':[{'type':'number', 'child':[5]}, {'type':'number', 'child':[12]}]}, {'type':'product', 'child':[{'type':'number', 'child':[5]}, {'type':'number', 'child':[8]}]}]}, {'type':'/', 'child':[{'type':'-', 'child':[{'type':'/', 'child':[{'type':'number', 'child':[23]}, {'type':'number', 'child':[42]}]}, {'type':'number', 'child':[23]}]}, {'type':'number', 'child':[21]}]}]}]}, {'type':'number', 'child':[3]}]}]};

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


        // /(-943 / 42 )  / 21


        break;


    }

    changed = false;
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

