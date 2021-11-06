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

// login and user authentication is done on device, credentials will be stored in AsyncStorage by (key, value) like anything else, i.e, (username, usernameValue) and (password, passwordValue) with an intermediary hashing library to keep security

export async function login (u, p) { //yet to be tested
  const username = await AsyncStorage.getItem('username');
  const password = await AsyncStorage.getItem('password');
  try {
    if (username !== null && password !== null) {
      if (u == username && p == password) {
        console.log('User successfully authenticated.');
        //TBD how we're going to handle login
        //TBD--password still stored in plain text
        //current user = 
      }
    }
  } catch(e) {
    console.log('User not found.');
  }
}

//pushMID()
/*update database with new user's MID
no parameters, call in createUser() using newUser.mid or something*/

//generateUniqueMID()
/*for deployment, thinking of setting range of random integers (1..5000), this keeps sort time low too
specific forrmat? alphanumeric? with dashes or special prefixes?*/

//generateUniquePostId()
//same specs as above

//createUser() returns a new User to be then be stored in the database
/*here's what needs to be done:
- generate unique MID
- intake necessary parameters, minus bio 
- store username/password */

//deleteUser()

/*export async function createUser() {

}*/

/*
  Keep in mind that all realtime Firebase data is stored as a JSON object.
*/