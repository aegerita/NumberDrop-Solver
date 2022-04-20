const utility = require("./utility.js");

// Change these two to solve the puzzle!
// Currently only support two-column games
const ARRAY = [7, 2, 8, 6, 9, 8, 8, 8];
const NUMS = [14, 255];

const ops = ['+', '-', '*', '/'];

/**
 * Try all four operations
 * @param {Number} a - the previous number
 * @param {Number} b - the latter number
 * @param {Boolean} doKeepAllNumbers 
 * @returns {Array[Number]} - all possible natural number result with a and b
 */
const tryThis = (a, b, doKeepAllNumbers) => {
    let ret = [a + b, a - b, a * b, a / b];
    // maintain index if want to reverse search operations with base 4
    if (!doKeepAllNumbers) ret = ret.filter(a => a % 1 === 0 && a > 0);
    return ret;
}

/**
 * Get the index of the operation order of a given set of permutation
 * if the permutation can calculate to given number
 * @param {Array[Numeber]} array - the permutation of numbers
 * @param {Number} num - the target number
 * @param {Boolean} doKeepAllNumbers - should or should not maintain index
 * @returns {Number} - the index of the operation order
 */
const getSteps = (array, num, doKeepAllNumbers) => {
    // use the first number, then first two, then... to go through all the numbers
    const result = array.reduce((preStepResult, currNum, currIndex) => {
        if (currIndex === 0)
            return preStepResult;
        // use all of the results from previous steps (curr) to try curr number
        const currStepResult = preStepResult.reduce((pre, curr) => {
            return pre.concat(tryThis(curr, currNum, doKeepAllNumbers));
        }, []);
        // console.log('new step', step, num);
        return currStepResult;
    }, [array[0]]);

    if (result.includes(num)) {
        // console.log(array, 'can get', num);
        return result.indexOf(num);
    } else {
        // console.log(array, 'cannot get', num);
        return -1;  // bad index
    }
}


let results = [[]];
// make the powerset have at least two elements in each set
const allCombinations = utility.powerset(ARRAY).filter(a =>
    a.length < ARRAY.length - 1 && a.length > 1);

for (const com of allCombinations) {
    // get the remaining set 
    // TODO: future feature: find out a way to have multiple columns, 
    //      currently only can have two with this method)
    let copy = [...ARRAY];
    for (let x of com) {
        copy = copy.slice(0, copy.indexOf(x)).concat(copy.slice(copy.indexOf(x) + 1));
    }
    // console.log('\n', com, copy);
    const setA = utility.permute(com).find(a => getSteps(a, NUMS[0]) > -1);
    const setB = utility.permute(copy).find(a => getSteps(a, NUMS[1]) > -1);
    if (setA && setB && JSON.stringify([setA, setB]) !== JSON.stringify(results)) {
        results = [setA, setB];
        // console.log('success :D', results);
        // break;
        // throw new Error('hey');
    };
}

/**
 * After getting the permutation set, run getSteps again to find the index,
 * then create the final result calculation sequence string to display
 * @param {Number} index - the index of the final result we want (currently only 0 or 1)
 * @returns 
 */
const stepToString = (index) => {
    const step = getSteps(results[index], NUMS[index], true)
        .toString(ops.length).padStart(results[index].length - 1, '0');

    let result = results[index][0].toString();
    [...step].forEach((_, i) => {
        // * and / has higher priority than other operations.
        // add bracket if they need to
        const op = ops[step[i]];
        const prevOp = ops[step[i - 1]] ?? '*';
        if (['*', '/'].includes(op) && !['*', '/'].includes(prevOp)) {
            result = `( ${result} ) ${op} ${results[index][i + 1]}`;
        }
        else result += ' ' + op + ' ' + results[index][i + 1];
    });
    return result;
}


console.log('The solution pairs are:');
for (const i in NUMS) {
    console.log(`  ♦  ${results[i]} can makes ${NUMS[i]} with ${stepToString(i)}`);
}
