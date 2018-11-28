export default function getStateList (table) {

    const fromList = table.map(item => item.from);
    const toList = table.map(item => item.to);

    return  [...new Set([...fromList, ...toList])];

}
