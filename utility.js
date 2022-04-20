/**
 // Get all power combinations of a set of number (including shorter lengths)
 * @param {Array[*]} array
 * @returns {Array[Array[*]]} powersets
 * @author: Mathias Bynens - https://codereview.stackexchange.com/a/154883
 */
 const powerset = (array) => { // O(2^n)
    const results = [[]];
    for (const value of array) {
        const copy = [...results]; // See note below.
        for (const prefix of copy) {
            results.push(prefix.concat(value));
        }
    }
    return results;
};

/**
 // Get all permutations of a set of number (TODO: defect: don't care abt same element)
 * @param {Array[*]} array
 * @returns {Array[Array[*]]} permutations
 * @author: le_m - https://stackoverflow.com/a/37580979/13216567
 */
const permute = (array) => {
    var length = array.length,
        result = [array.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = array[i];
            array[i] = array[k];
            array[k] = p;
            ++c[i];
            i = 1;
            result.push(array.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

module.exports = { powerset, permute };