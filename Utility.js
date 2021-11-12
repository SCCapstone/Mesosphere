import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from './firebaseConfig.js';
// import {} from './Post'
export const PAGES = {
  LOGIN: 0,
  USERINFO: 1,
  ACCOUNTPAGE: 2
}

//database is a reference to firebaseConfig that lets us query the database directly

/* Data manipulation methods:
  quicksort is faster than default JS sort algorithms
*/
function swap (items, leftIndex, rightIndex) {
  const temp = items[leftIndex]
  items[leftIndex] = items[rightIndex]
  items[rightIndex] = temp
}

function partition (items, left, right) {
  const pivot = items[Math.floor((right + left) / 2)]
  let i = left
  let j = right
  while (i <= j) {
    while (items[i] < pivot) {
      i++
    }
    while (items[j] > pivot) {
      j--
    }
    if (i <= j) {
      swap(items, i, j)
      i++
      j--
    }
  }
  return i
}

function qsort (items, left, right) { // main call will be qsort(arr, 0, arr.length - 1) when generically sorting an entire array
  let index
  if (items.length > 1) {
    index = partition(items, left, right)
    if (left < index - 1) {
      qsort(items, left, index - 1)
    }
    if (index > right) {
      qsort(items, index, right)
    }
  }
  return items
}

function binarySearch (sortedArray, key) {
  let start = 0
  let end = sortedArray.length - 1
  while (start <= end) {
    const middle = Math.floor((start + end) / 2)
    if (sortedArray[middle] === key) {
      // item exists
      return middle
    } else if (sortedArray[middle] < key) {
      // keep searching right
      start = middle + 1
    } else {
      // search left
      end = middle - 1
    }
  }
  // Item is not in array
  return -1
}

/*p2p data flow will be structured as follows:
  Post rendering will be done at-demand.
  When a post is rendered on the screen (in feed or specifically searching),
  a data stream will be opened to grab it from the origin.
  A connection will be made so that the data can be transmitted.
  For performance's sake, this will have to be temporary, so the post will be stored after transmission on the viewer device in app memory.
*/
//WebRTC methods//

let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;

// until I can get Firebase working, https://switchboard.rtc.io COULD work as a decent signalling server

var dataSettings = [
  {
    iceServers: [{url: 'stun.l.google.com:19302'}]
  }
];
var dataChannels = {};
var pendingDataChannels = {};
