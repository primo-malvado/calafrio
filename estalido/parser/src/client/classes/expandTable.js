Array.prototype.unique = function () {
    const unique = [];
    for (let i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};


export default function expandTable (table) {
    const froms = table.map(item => item._ft_.charCodeAt(0));

    const tos = table.map(item => item._tt_.charCodeAt(0) + 1);

    const breaks = froms.concat(tos).unique().sort();

    const newTable = [];

    table.forEach((item) => {
        let f = item._ft_.charCodeAt(0);
        const t = item._tt_.charCodeAt(0);

        let changed = false;
        breaks.forEach((_break) => {
            changed = false;
            if (_break > f && _break <= t) {
                const _new = {
                    _ft_: String.fromCharCode(f),
                    _tt_: String.fromCharCode(_break - 1),
                    from: item.from,
                    to: item.to
                };
                newTable.push(_new);

                f = _break;
                changed = true;
            }
        });

        if (!changed) {
            newTable.push(

                {
                    _ft_: String.fromCharCode(f),
                    _tt_: String.fromCharCode(t),
                    from: item.from,
                    to: item.to
                },
            );
        }
    });

    return newTable;
}
;
