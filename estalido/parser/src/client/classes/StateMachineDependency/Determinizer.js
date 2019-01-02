

import expandTable from '../expandTable';


function intersection (x, y) {
    x.sort(); y.sort();
    let i = 0;
    let j = 0;
    const ret = [];
    while (i < x.length && j < y.length) {
        if (x[i] < y[j]) {
            i++;
        } else if (y[j] < x[i]) {
            j++;
        } else {
            ret.push(x[i]);
            i++, j++;
        }
    }
    return ret;
}

let lastId = 0;
function getNextId () {
    const n = lastId++;
    return `${n}`;
}


function getReachableStates (table, states) {
    const lista = table.filter((item) => {
        if (item.token) {
            return states.indexOf(item.from) !== -1 && item.token === 'ε';
        }

        return states.indexOf(item.from) !== -1 && item._ft_ === 'ε' && item._tt_ === 'ε';
    })
        .map(item => item.to);

    const newList = [...new Set([...lista, ...states])];
    if (states.length === newList.length) {
        return newList;
    }
    return getReachableStates(table, newList);
}


function getReachableStatesWithToken (config, states, _ft_, _tt_) {
    const lista = config.table.filter((item) => {
        if (item.token) {
            return states.indexOf(item.from) !== -1 && ((item.token == _ft_));
        }

        return states.indexOf(item.from) !== -1 && ((item._ft_ <= _ft_ && item._tt_ >= _tt_));
    })
        .map(item => item.to);

    return getReachableStates(config.table, lista);
}


export function determinize (structure) {
    lastId = 0;
    const monitor = {
        idMap: {},
        processed: {}
    };


    const configOriginal = {
        table: expandTable(structure.table),
        start: structure.start,
        endMap: structure.endMap,
        end: structure.end
    };


    const configDfa =        {
        table: [],
        start: [],
        end: []

    };
    configDfa.endMap = {};


    const prev = getReachableStates(configOriginal.table, configOriginal.start);


    helper(configOriginal, configDfa, prev, monitor, true);

    return configDfa;
}

function helper (configOriginal, configDfa, prev, monitor, isStart = false) {
    const prevKey = prev.sort().join('_');

    if (monitor.processed[prevKey] === undefined) {
        monitor.processed[prevKey] = {};

        if (monitor.idMap[prevKey] === undefined) {
            const nextId = getNextId();
            monitor.idMap[prevKey] = nextId;

            if (isStart) {
                configDfa.start.push(nextId);
            }
            if (intersection(configOriginal.end, prev).length > 0) {
                configDfa.end.push(nextId);

                if (configOriginal.endMap) {
                    const func = prev.map(id => configOriginal.endMap[id]).filter(item => item !== undefined).sort((a, b) => a.priority - b.priority);

                    configDfa.endMap[nextId] = {
                        parseFunction: func[0].parseFunction
                    };
                }
            }
        }

        const jumps = configOriginal.table.filter(item => prev.indexOf(item.from) !== -1);

        jumps.forEach((jump) => {
            if (jump._ft_ !== 'ε' && monitor.processed[prevKey][jump._ft_] === undefined) {
                monitor.processed[prevKey][jump._ft_] = true;
                _determinize(configOriginal, configDfa, prev, jump, monitor);
            }
        });
    }
}

function _determinize (configOriginal, configDfa, prev, _jump, monitor) {
    const next = getReachableStatesWithToken(configOriginal, prev, _jump._ft_, _jump._tt_);

    const prevKey = prev.sort().join('_');
    const nextKey = next.sort().join('_');

    if (monitor.idMap[nextKey] === undefined) {
        const nextId = getNextId();
        monitor.idMap[nextKey] = nextId;

        if (intersection(configOriginal.end, next).length > 0) {
            configDfa.end.push(nextId);

            if (configOriginal.endMap) {
                const func = next.map(id => configOriginal.endMap[id]).filter(item => item !== undefined)
                    .sort((a, b) => a.priority - b.priority);

                configDfa.endMap[nextId] = {
                    parseFunction: func[0].parseFunction
                };
            }
        }
    }

    configDfa.table.push(
        {
            _ft_: _jump._ft_,
            _tt_: _jump._tt_,
            from: monitor.idMap[prevKey],
            to: monitor.idMap[nextKey]

        });

    helper(configOriginal, configDfa, next, monitor, false);
}
