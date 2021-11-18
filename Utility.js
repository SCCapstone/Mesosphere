import AsyncStorage from '@react-native-async-storage/async-storage'
import { database } from './firebaseConfig.js'
import Libp2p from 'libp2p'
import WebSockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import KadDHT from 'libp2p-kad-dht' // to be used in best case
import Bootstrap from 'libp2p-bootstrap'
import { sha256, sha224 } from 'js-sha256';

//
// import {} from './Post'

export const PAGES = {
  LOGIN: 0,
  USERINFO: 1,
  ACCOUNTPAGE: 2
}



// database is a reference to firebaseConfig that lets us query the database directly, all database functions should use it in this file

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

function generateUniqueMID () {
  // query MIDs from firebase, document is 'main', collection is 'IDS', an array called MIDS is stored there
  // for prototype code, call it arr
  var arr = []
  let ID = "meso-" + String(sha224(arr.length + 1)) //will always be random since we're hashing array length in an immutable array, using 224 for smaller footprint
  arr.push(ID)
  AsyncStorage.setItem('MID', ID)
}

function generatePostID () {
  // query MIDs from firebase, document is 'main', collection is 'IDS', an array called MIDS is stored there
  // for prototype code, call it arrPosts
  var arrPosts = []
  let ID = sha224(arr.length + (Math.random() * 10))
  arr.push(ID) //nothing fancy needed, using a random number for some more noise
  return ID //this value is to be used when creating a new post! also should be added to the current User's array of post IDs
}

// alternatively, instead of querying random numbers from an ever-changing database, what if we hash the length of the array with something so that the value is always unique? postIDs are never deleted so the array will never be the decremented in size after a post is made.

/* Data flow will have to work on-demand.
Each device will need to be constantly open and able to accept connections from peers
(note: consider calling 'friends' on the app 'peers')
post ids will act as pointers to content
I envision how it will work is:
  peer requests post via post id ->
  peer sends post id over network ->
  host receives post id in a message ->
  host queries AsyncStorage for a post whose key is the id ->
  host sends peer the queried data

  for performance's sake, the connection will have to close after that, and the post will be saved in cache/temp memory during app runtime

  some questions arise:
    - once I've saved someone's MID and added them to my peers, how can I route with them?
      TBD, not sure, via some sort of peer discovery protocol using MID as a peerID

    - how will I know when someone makes a new post?
      when a new post is created, the User's postList[] is updated to hold the new post id,
      peers will have to manually update (refresh) or set update to time interval to update
      list of postIDs
*/

/* Firebase configuration is setup in this directory with
  database.rules.json
  .firebaserc
  firebase.json
  firebaseConfig.js
*/

//collection 'main', document 'IDS'

//const THIS_PEER_ID = AsyncStorage.getItem('MID') // or whatever we do to reference stored MID

// export async function initNode () {
//   const node = await Libp2p.create({
//     addresses: {
//       // signalling server address(es), libp2p will attempt to dial the server to coordinate connection from fellow peers
//       listen: [ // keep in mind below are public, testing servers, STILL NEED TO CONNECT TO FIREBASE
//         '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
//         '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
//         '/ip4/127.0.0.1/tcp/8000/ws',
//       ]
//     },
//     modules: {
//       transport: [WebSockets, WebRTCStar],
//       peerDiscovery: [Bootstrap],
//       dht: KadDHT
//     },
//     config: {
//       peerDiscovery: {
//         [Bootstrap.tag]: {
//           enabled: true,
//           list: [
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
//             '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
//           ]
//         }
//       },
//       dht: {
//         enabled: true
//       }
//     }
//   })

//   node.on('peer:discovery', (peer) => {
//     alert('Discovered %s', peer.id) // discovered peer
//   })
//   node.connectionManager.on('peer:connect', (connection) => {
//     alert('Connected to %s', connection.remotePeer) // connected peer
//   })
//   await node.start()
// }
