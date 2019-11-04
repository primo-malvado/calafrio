import getStateList from '../../misc/getStateList';
import expandTable from '../../misc/expandTable';


function intersept (array1, array2){
    return array1.filter(function (n) {
        return array2.indexOf(n) !== -1;
    });
}

function unicos (myArray){
    return [...new Set(myArray)];
}


export function minimize (originalStructure) {

    const expandedTable = expandTable(originalStructure.table);
    const statesList = getStateList(expandedTable);

    statesList.push('sink');


    let theListUnique = {};

    let unprocessed = [];

    let theTable = {};


    // extend table to be easyly walked
    for (let i = 0; i< originalStructure.table.length; i++){
        let n = originalStructure.table[i];

        if(theTable[n.from ] === undefined){
            theTable[n.from ] = {};
        }
        theTable[n.from ][n._ft_] = n.to;
    }


    // criar a lista inicial com os pares unicos, e nao processados
    for (let i = 0; i< statesList.length-1; i++){
        if(theListUnique[ statesList[i] ] === undefined){

            theListUnique[ statesList[i] ] = {};
        }

        for (let j = i+1; j< statesList.length; j++){


            if(theListUnique[ statesList[j] ] === undefined){

                theListUnique[ statesList[j] ] = {};
            }

            if((originalStructure.end.indexOf(statesList[i]) !== -1) !== (originalStructure.end.indexOf(statesList[j]) !== -1)){

                theListUnique[ statesList[i] ][statesList[j]] = true;
                theListUnique[ statesList[j] ][statesList[i]] = true;
            }else{
                unprocessed.push([statesList[i], statesList[j]]);
            }


        }
    }


    let lastCount = 0;
    if(lastCount !== unprocessed.length)
    {
        lastCount = unprocessed.length;

        for(let x = 0; x < lastCount ; x++){
            isUniqueAll(theTable, theListUnique, unprocessed);
        }

    }


    // unprocessed = [[2, 3], [2, 5], [5, 4], [8, 1]]
    let processed = [];


    let unprocessedLen = 0; // unprocessed.length;


    while(unprocessedLen !== unprocessed.length)
    {

        unprocessedLen = unprocessed.length;

        let current;
        while(  current =  unprocessed.pop()){

            let find = false;
            for(let i = 0 ; !find && i  < processed.length; i++){
                if(intersept(processed[i], current).length > 0)
                {
                    console.log(processed[i], current);

                    processed[i] = unicos(processed[i].concat(current));

                    find = true;

                }
            }


            if(!find){
                processed.push(current);

            }
        }


        unprocessed = processed;
        processed = [];
    }


    let map = {};


    unprocessed.forEach(function (item){
        let name = item.join(',');
        item.forEach(function (stat){

            map[stat] = name;
        });
    });


    originalStructure.table.forEach(function (xx){
        xx.from = map[xx.from] ? map[xx.from]: xx.from;
        xx.to = map[xx.to] ? map[xx.to]: xx.to;
    });


    for(let i = 0; i< originalStructure.end.length; i++){
        originalStructure.end[i] = map[originalStructure.end[i]] ? map[originalStructure.end[i]]: originalStructure.end[i];
    }


    for(let i = 0; i< originalStructure.start.length; i++){
        originalStructure.start[i] = map[originalStructure.start[i]] ? map[originalStructure.start[i]]: originalStructure.start[i];
    }


    let table = [];

    while(originalStructure.table.length){
        let temp = originalStructure.table.pop();
        table.push(temp);

        originalStructure.table = originalStructure.table.filter(function (item){
            return item._ft_ !== temp._ft_ ||
                item._tt_ !== temp._tt_ ||
                item.from !== temp.from ||
                item.to !== temp.to;


        });


    }


    originalStructure.table = table;


    return  originalStructure;
}


function isUniqueAll (theTable, theListUnique, unprocessed){


    let item = unprocessed.pop();


    let l1 = theTable[item[0]];

    let l2 = theTable[item[1]];

    let tokens1 = l1===undefined ? [] : Object.keys(l1);
    let tokens2 = l2===undefined ? [] : Object.keys(l2);
    let tokenList = unicos(tokens1.concat(tokens2));

    for(let i = 0; i< tokenList.length; i++){

        let token = tokenList[i];


        let to1 = theTable[item[0]] && theTable[item[0]][token] ?                theTable[item[0]][token] : 'sink';
        let to2 = theTable[item[1]] && theTable[item[1]][token] ?                theTable[item[1]][token] : 'sink';


        let isUniqueX =  theListUnique[to1] && theListUnique[to1][to2] ? true: false;


        if(isUniqueX)
        {

            theListUnique[item[0]][item[1]] = true;
            theListUnique[item[1]][item[0]] = true;
            return true;


        }


    }

    unprocessed.unshift(item);


    return false;


}
