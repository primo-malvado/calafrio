// import Viz from "viz.js/viz.js";
// globals Viz
import getStateList from '../getStateList';


function getId (name){

    return name.replace(/,/g, '');


}


export function dotRenderer (stateMachine) {


    let string = `digraph finite_state_machine {
    rankdir=LR;

    `;

    stateMachine.states = getStateList(stateMachine.table);

    for (let i = 0; i < stateMachine.states.length; i++) {
        let shape = 'circle';

        if (stateMachine.end.indexOf(stateMachine.states[i]) !== -1) {
            shape = 'doublecircle';
        }

        string += `node [shape = ${shape}, label="${stateMachine.states[i]}"] n${getId(stateMachine.states[i])};\n`;

        if (stateMachine.start.indexOf(stateMachine.states[i]) !== -1) {
            string += `node [shape = point] point${getId(stateMachine.states[i])};\n`;
            string += `point${getId(stateMachine.states[i])} -> n${getId(stateMachine.states[i])};\n`;
        }
    }

    for (let i = 0; i < stateMachine.table.length; i++) {
        if (stateMachine.table[i].token) {
            stateMachine.table[i]._ft_ = stateMachine.table[i].token;
            stateMachine.table[i]._tt_ = stateMachine.table[i].token;
        }

        let label = encodeURI(stateMachine.table[i]._ft_ === stateMachine.table[i]._tt_ ? stateMachine.table[i]._ft_ : `[${stateMachine.table[i]._ft_}-${stateMachine.table[i]._tt_}]`);

        label = label.replace('%CE%B5', 'ε');
        label = label.replace('%5B', '[');
        label = label.replace('%5D', ']');
        label = label.replace('%7B', '{');
        label = label.replace('%7C', '|');
        label = label.replace('%7D', '}');
        label = label.replace('%5C', '\\\\');
        label = label.replace('%20', '\\\\s');
        label = label.replace('%09', '\\\\t');
        label = label.replace('%0A', '\\\\n');
        label = label.replace('%0D', '\\\\r');
        label = label.replace('%3C', '<');
        label = label.replace('%3D', '=');
        label = label.replace('%3E', '>');
        label = label.replace('%5E', '^');
        label = label.replace('%25', '%');

        string += `n${getId(stateMachine.table[i].from)} -> n${getId(stateMachine.table[i].to)}[ label="${label}"];\n`;
    }

    string += '}\n';

    // console.log(string)

    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = Viz(string, 'svg');
    document.body.appendChild(resultDiv);
}
