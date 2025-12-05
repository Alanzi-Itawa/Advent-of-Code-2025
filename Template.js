function dayXXa(input) {
  
}

/** ========== Helper functions ========== */
// Arrays -- Also remember concat(array), slice( [start,end) ), and splice(index, numToRemove, itemsToAdd...)
function arrayContains(inputArr, val) { return inputArr.indexOf(val) !== -1; }
function arrayIntersection(array1, array2) { return array1.filter(value => array2.includes(value)); }
function removeItemFromArray(inputArr, val) { if (arrayContains(inputArr, val)) { inputArr.splice(inputArr.indexOf(val), 1); } }
// Strings
function replaceCharAt(inputStr, index, character) { return inputStr.substr(0, index) + character + inputStr.substr(index + 1); }
function cutOutCharAt(inputStr, index) { return inputStr.substr(0, index) + inputStr.substr(index + 1); }
function stringContains(inputStr, subStr) { return inputStr.indexOf(subStr) !== -1; }
// Binary
function bin2dec(bin) { return parseInt(bin, 2); }
function dec2bin(dec) { return (dec >>> 0).toString(2); }
// Other
function deepCopy(input) { return JSON.parse(JSON.stringify(input)); }
/** ====================================== */

var dayInput = "";
//var dayInput = "";

dayXXa(dayInput);
//dayXXb(dayInput);
