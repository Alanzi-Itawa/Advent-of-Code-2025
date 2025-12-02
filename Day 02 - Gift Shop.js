
function day02a(input) {
  var ids = input.split(",");
  var invalidSum = 0;
  for (var i = 0; i < ids.length; i++) {
    var first = ids[i].split("-")[0];
    var second = ids[i].split("-")[1];
    for (var j = Number(first); j <= Number(second); j++) {
      if (String(j).length % 2 === 1) { continue; }
      var halfSize = String(j).length / 2;
      if (String(j).substr(0, halfSize) === String(j).substr(halfSize)) {
        invalidSum += j;
      }
    }
  }
  console.log(invalidSum);
}

function day02b(input) {
  var ids = input.split(",");
  var invalidSum = 0;
  for (var i = 0; i < ids.length; i++) {
    var first = ids[i].split("-")[0];
    var second = ids[i].split("-")[1];
    for (var j = Number(first); j <= Number(second); j++) {
      for (var k = 1; k < String(j).length; k++) {
        var set = new Set();
        var str = String(j);
        while (str.length > 0) {
          set.add(str.substr(0, k));
          str = str.substr(k);
        }
        if (set.size === 1) {
          invalidSum += j;
          break;
        }
      }
    }
  }
  console.log(invalidSum);
}

/** ========== Helper functions ========== */
// Arrays -- Also remember concat(array), slice( [start,end) ), and splice(index, numToRemove, itemsToAdd...)
function arrayContains(inputArr, val) { return inputArr.indexOf(val) !== -1; }
function arrayIntersection(array1, array2) { return array1.filter(value => array2.includes(value)); }
function removeItemFromArray(inputArr, val) { if (arrayContains(inputArr, val)) { inputArr.splice(inputArr.indexOf(val), 1); } }
// Strings
function replaceCharAt(inputStr, index, character) { return inputStr.substr(0, index) + character + inputStr.substr(index + 1); }
function stringContains(inputStr, subStr) { return inputStr.indexOf(subStr) !== -1; }
// Binary
function bin2dec(bin) { return parseInt(bin, 2); }
function dec2bin(dec) { return (dec >>> 0).toString(2); }
// Other
function deepCopy(input) { return JSON.parse(JSON.stringify(input)); }
/** ====================================== */

var dayInput = "10327-17387,74025-113072,79725385-79874177,964628-1052240,148-297,3-16,126979-227778,1601-2998,784-1207,831289-917268,55603410-55624466,317-692,602197-750430,17-32,38-58,362012-455626,3622441-3647505,883848601-883920224,62-105,766880-804855,9184965756-9185005415,490073-570277,2929273115-2929318135,23251-48475,9696863768-9697013088,229453-357173,29283366-29304416,4526-8370,3095-4389,4400617-4493438";
//var dayInput = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";
//var dayInput = "11-22";

day02a(dayInput);
day02b(dayInput);
