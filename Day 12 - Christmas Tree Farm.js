
// Works for simple case but takes forever running through the possibilities if no solution found.

function day12a(input) {
  
  var width = 12;
  var height = 5;
  var remaining = [1,0,1,0,3,2];
  
  // . is 0 and # is 1
  var state = "";
  for (var y = 0; y < height; y++) {
    state += "0".repeat(width);
    state += "1".repeat(2);
  }
  state += "1".repeat((width + 2) * 2);
  return pack(deepCopy(state), deepCopy(remaining), width, height);
}

function pack(state, remaining, width, height) {
  // If array is empty, success!
  var packedAll = true;
  for (var i = 0; i < remaining.length; i++) {
    if (remaining[i] > 0) {
      packedAll = false;
      break;
    }
  }
  if (packedAll) {
    return true; // Success!
  }
  
  // For each present left...
  for (var i = 0; i < remaining.length; i++) {
    if (remaining[i] > 0) {
      // For each relevant rotation and flip of the present...
      var presentVariations = getVariations(presents[i]);
      
      // For each x,y
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          for (var pv = 0; pv < presentVariations.length; pv++) {
            var compareAgainst =
                state[x + (y * (width + 2))] + state[x+1 + (y * (width + 2))] + state[x+2 + (y * (width + 2))] +
                state[x + ((y+1) * (width + 2))] + state[x+1 + ((y+1) * (width + 2))] + state[x+2 + ((y+1) * (width + 2))] +
                state[x + ((y+2) * (width + 2))] + state[x+1 + ((y+2) * (width + 2))] + state[x+2 + ((y+2) * (width + 2))];
            var present = presentVariations[pv];
            
            if ((bin2dec(compareAgainst) & bin2dec(present)) === 0) {
              // It fits!  Continue.
              var newState = deepCopy(state);
              newState = replaceCharAt(
                  newState,
                  x + (y * (width + 2)),
                  present[0]);
              newState = replaceCharAt(
                  newState,
                  x+1 + (y * (width + 2)),
                  present[1]);
              newState = replaceCharAt(
                  newState,
                  x+2 + (y * (width + 2)),
                  present[2]);
              newState = replaceCharAt(
                  newState,
                  x + ((y+1) * (width + 2)),
                  present[3]);
              newState = replaceCharAt(
                  newState,
                  x+1 + ((y+1) * (width + 2)),
                  present[4]);
              newState = replaceCharAt(
                  newState,
                  x+2 + ((y+1) * (width + 2)),
                  present[5]);
              newState = replaceCharAt(
                  newState,
                  x + ((y+2) * (width + 2)),
                  present[6]);
              newState = replaceCharAt(
                  newState,
                  x+1 + ((y+2) * (width + 2)),
                  present[7]);
              newState = replaceCharAt(
                  newState,
                  x+2 + ((y+2) * (width + 2)),
                  present[8]);
              var newRemaining = deepCopy(remaining);
              newRemaining[i]--;
              var result = pack(newState, newRemaining, width, height);
              if (result) { return true; }
            }
          }
        }        
      }
    }
  }
  return false;
  
  /**
  
  - recursion
  - take in state and present array
  
  - if array is empty, success!
  
  - for each present
    - for each rotation and flip of the present
      - for (x,y (-2)), go through it until it fits
      - if it fits, call self with one less in that part of the array
      - if it doesn't fit, don't call self (skips)
      
  */
  
}

function getVariations(present) {
  var presentSet = new Set();
  
  var cp = present;
  for (var i = 0; i < 4; i++) {
    // Rotate 90 deg:
    cp = cp[6] + cp[3] + cp[0] + cp[7] + cp[4] + cp[1] + cp[8] + cp[5] + cp[2];
    presentSet.add(cp);
    
    // Flip horizontally:
    cp = cp[2] + cp[1] + cp[0] + cp[5] + cp[4] + cp[3] + cp[8] + cp[7] + cp[6];
    presentSet.add(cp);
    
    // Flip vertically:
    cp = cp[6] + cp[7] + cp[8] + cp[3] + cp[4] + cp[5] + cp[0] + cp[1] + cp[2];
    presentSet.add(cp);
    
    // Flip horizontally again:
    cp = cp[2] + cp[1] + cp[0] + cp[5] + cp[4] + cp[3] + cp[8] + cp[7] + cp[6];
    presentSet.add(cp);
    
    // Flip vertically again:
    cp = cp[6] + cp[7] + cp[8] + cp[3] + cp[4] + cp[5] + cp[0] + cp[1] + cp[2];
  }
  return Array.from(presentSet);
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

var presents = ["111110110", "111110011", "011111110", "110111110", "111100111", "111010111"];


day12a(dayInput);
//day12b(dayInput);


/*
0: 111110110
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###
*/