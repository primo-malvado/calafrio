#include <stdio.h>
#include <string.h>
#include <stdlib.h>
/*
void createRelay(char* options, int relayCount){

    int optionsLen = sizeof(options)/sizeof(options[0]);
    
    for (int i3 = 0; i3< optionsLen; i3++){

        for (int j3 = 0; j3< optionsLen; j3++){
            if(i3!= j3){

                for (int k3 = 2; k3< optionsLen; k3++){
                    //console.log(relayCount, " - ", options[i3], options[j3], options[k3])
                    
                    if(relayCount >1 )
                    {
                        //int temp2 = options.concat(["o"+relayCount])

                        char* temp2 = options;
                        createRelay(temp2, relayCount-1);
                    }
                }
            }
        }
    }          
}
*/


void createRelay(int optionsLen, int relayCount, int* count){


 
    for (int i3 = 0; i3< optionsLen; i3++){

        for (int j3 = 0; j3< optionsLen; j3++){
            if( !(i3 == 0 && j3 ==1) &&   i3!= j3){

                for (int k3 = 2; k3< optionsLen; k3++){
 
                    if(relayCount >1 )
                    {

                        createRelay(optionsLen+1, relayCount-1, count);
                    }else{
                        (*count)++;
                    }
                }
            }
        }
    }          
}




int main(int argc, char **argv){
    char* logical[] = {"false", "true"};
    char* input[] = {"a", "b", "c"};
    char* output[] = {"cout", "res"};



    char* temp[] = {"false", "true", "a", "b", "c"};





    char* temp2 = realloc(temp,  sizeof(char *) * ( 5 + 1 ) );
    strcpy(&(temp2[5]), "out1");

    printf("%s\n", &temp2[5]); // prints blah


    int relayCount = 2;

    int count = 0;

/*
    printf("%s\n", logical[0]); // prints blah
*/
    //createRelay(*temp, relayCount);
    createRelay(4, relayCount,  &count);

    printf("%d\n", count); // prints blah

    return 1;
}

/*

    var l = [0,1];
    var i = ["a", "b", "c", "d", "e"];
    var o = ["cout","res" ];
    var temp = [].concat(l, i);
    console.log(temp)
    var relayCount = 3;
    createRelay(temp, relayCount);

*/