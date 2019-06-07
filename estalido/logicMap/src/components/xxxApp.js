




function createShiftAdd3(list, name, parentName, a,b,c,d) {
/*
m=c?1:d    
B=m?a:b  
A=b?m:a
n=d?0:A   
C=n?a:c       
D=A?n:d
*/



    createRelay(list, name+".m", name, c,         "one",        d)
    createRelay(list, name+".B", name,   name+".m", a,          b)
    createRelay(list, name+".A", name,   b,         name+".m",  a)
    createRelay(list, name+".n", name, d,         "zero",       name+".A")
    createRelay(list, name+".C", name, name+".n",         a,          c)
    createRelay(list, name+".D", name, name+".A", name+".n",  d)


    list[name] = {
        type: "shiftadd3",
        parent:parentName,


        a: a,
        b: b,
        c: c,
        d: d,


        A: name+".A",
        B: name+".B",
        C: name+".C",
        D: name+".D",
        




        aValue: list[a].output,
        bValue: list[b].output,
        cValue: list[c].output,
        dValue: list[d].output,


        AValue: list[name+".A"].output,
        BValue: list[name+".B"].output,
        CValue: list[name+".C"].output,
        DValue: list[name+".D"].output,
        
    };



 
}

function create7SegmentDecoder(list, name, parentName, a,b,c,d) {
 

    createRelay(list, name+".m", name, b, c, "one");
    createRelay(list, name+".n", name,d, a, "one");
    createRelay(list, name+".p", name,c, d, name+".n");
    createRelay(list, name+".E", name,d, "zero", name+".m");
    createRelay(list, name+".F", name,name+".p", name+".n", b);
    createRelay(list, name+".B", name,b, name+".p", "one");
    createRelay(list, name+".C", name,d, "one", name+".F");
    createRelay(list, name+".q", name,b, name+".F", c);
    createRelay(list, name+".A", name,name+".p", name+".m", name+".q");
    createRelay(list, name+".D", name,name+".n", name+".m", name+".q");
    createRelay(list, name+".G", name,a, "one", name+".q");




    list[name] = {
        type: "7segmentdecoder",
        parent:parentName,


        a: a,
        b: b,
        c: c,
        d: d,


        A: name+".A",
        B: name+".B",
        C: name+".C",
        D: name+".D",
        E: name+".E",
        F: name+".F",
        G: name+".G",


        aValue: list[a].output,
        bValue: list[b].output,
        cValue: list[c].output,
        dValue: list[d].output,


        AValue: list[name+".A"].output,
        BValue: list[name+".B"].output,
        CValue: list[name+".C"].output,
        DValue: list[name+".D"].output,
        EValue: list[name+".E"].output,
        FValue: list[name+".F"].output,
        GValue: list[name+".G"].output,
        
    };


 
}

function create7Seg(list, name, A, B, C, D, E, F, G) {

    list[name] = {
        type: "7seg",

        A: A,
        B: B,
        C: C,
        D: D,
        E: E,
        F: F,
        G: G,

        AValue: list[A].output,
        BValue: list[B].output,
        CValue: list[C].output,
        DValue: list[D].output,
        EValue: list[E].output,
        FValue: list[F].output,
        GValue: list[G].output,
    };
}

var list = {

    one: {
        output: 1,
        type: "const"
    },
    zero: {
        output: 0,
        type: "const"
    },

    a: {
        parent: "",
        output: 0,
        type: "switch"
    },
    b: {
        parent: "",
        output: 0,
        type: "switch"
    },


/*
    c: {
        parent: "",
        output: 0,
        type: "switch"
    },
    d: {
        parent: "",
        output: 0,
        type: "switch"
    },
    e: {
        parent: "",
        output: 0,
        type: "switch"
    },
    f: {
        parent: "",
        output: 0,
        type: "switch"
    },
    g: {
        parent: "",
        output: 0,
        type: "switch"
    },
    h: {
        parent: "",
        output: 0,
        type: "switch"
    }
*/

}
 
/*
createShiftAdd3(list, "c1", "", "zero","a","b","c");
createShiftAdd3(list, "c2", "", "c1.B","c1.C","c1.D","d");
createShiftAdd3(list, "c3", "", "c2.B","c2.C","c2.D","e");
createShiftAdd3(list, "c4", "", "c3.B","c3.C","c3.D","f");
createShiftAdd3(list, "c5", "", "c4.B","c4.C","c4.D","g");
createShiftAdd3(list, "c6", "", "zero","c1.A","c2.A","c3.A");
createShiftAdd3(list, "c7", "", "c6.B","c6.C","c6.D","c4.A");

create7SegmentDecoder(list, "decCen", "", "zero", "zero", "c6.A", "c7.A")
create7SegmentDecoder(list, "decDez", "", "c7.B", "c7.C", "c7.D", "c5.A")
create7SegmentDecoder(list, "decUni", "", "c5.B", "c5.C", "c5.D", "h")

create7Seg(list, "displayCen", "decCen.A", "decCen.B", "decCen.C", "decCen.D", "decCen.E", "decCen.F", "decCen.G");
create7Seg(list, "displayDez", "decDez.A", "decDez.B", "decDez.C", "decDez.D", "decDez.E", "decDez.F", "decDez.G");
create7Seg(list, "displayUni", "decUni.A", "decUni.B", "decUni.C", "decUni.D", "decUni.E", "decUni.F", "decUni.G");
*/



createRelay(list, "reset", "", "a", "zero", "one");
createRelay(list, "set", "", "b", "reset", "zero");




 












