
import { minimize } from './StateMachineDependency/Minimizer';
import { determinize } from './StateMachineDependency/Determinizer';
// import { dotRenderer } from './StateMachineDependency/DotRenderer';

import RegexToNfa from './RegexToNfa';


function RegexToDfa (regex) {

    let sm = RegexToNfa(regex);


    // dotRenderer(sm);


    let det = determinize(sm);

    // dotRenderer(det);


    let min = minimize(det);

    return min;

}

export default RegexToDfa;
