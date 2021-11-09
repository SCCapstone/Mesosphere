import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDatabase, ref, set, onValue } from 'firebase/database'

export const PAGES = {
  LOGIN: 0,
  USERINFO: 1,
  ACCOUNTPAGE: 2
}



//JS default sort() is insertion sort on Chrome, and merge sort for Firefox/Safari, neither of these are optimal when sorting large datasets like post ID's or MID
function swap(items, leftIndex, rightIndex){
  var temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

function partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)],
  i = left,
  j = right;
  while (i <= j) {
    while (items[i] < pivot) {
      i++;
    }
    while (items[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j);
      i++;
      j--;
    }
  }
  return i;
}

function qsort(items, left, right) {
  var index;
  if (items.length > 1) {
    index = partition(items, left, right);
    if (left < index - 1) {
      qsort(items, left, index - 1);
    }
    if (index > right) {
      qsort(items, index, right);
    }
  }
  return items;
}

class post {
  constructor(data, timestamp, id) {
    this.data = data;
    this.timestamp = timestamp;
    this.id = id;
  }

  toString() {
    return ("Post ID: " + this.id + "\nData: " + this.data + "\nTimestamp: " + this.timestamp);
  }
}

export async function getPost(key) {
  var value = await AsyncStorage.getItem(key);
  return value;
}

export async function dataToPost(data, keyList) {
  let newKey = Math.floor(Math.random() * 1000);
  if (keyList.indexOf(newKey)) {
    newKey = Math.floor(Math.random() * 1000);
  } else {
    keyList.push(newKey);
    posts.push(new post(data, new Date(), newKey));
    //storeData(newKey, new post(data, new Date(), newKey));
  }
  alert((new post(data, new Date(), newKey)).toString()); //works, used to test if all works
  //alert(getPost(newKey));
}

// login and user authentication is done on device, credentials will be stored in AsyncStorage by (key, value) like anything else, i.e, (username, usernameValue) and (password, passwordValue) with an intermediary hashing library to keep security

// export async function login (u, p) { //yet to be tested
//   const username = await AsyncStorage.getItem('username');
//   const password = await AsyncStorage.getItem('password');
//   try {
//     if (username !== null && password !== null) {
//       if (u == username && p == password) {
//         console.log('User successfully authenticated.');
//         //TBD how we're going to handle login
//         //TBD--password still stored in plain text
//         //current user = 
//       }
//     }
//   } catch(e) {
//     console.log('User not found.');
//   }
// }

/*
  Keep in mind that all realtime Firebase data is stored as a JSON object.
*/