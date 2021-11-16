import AsyncStorage from '@react-native-async-storage/async-storage'
import { database } from './firebaseConfig.js'
import Libp2p from 'libp2p'
import WebSockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import KadDHT from 'libp2p-kad-dht' // to be used in best case
import Bootstrap from 'libp2p-bootstrap'
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
  const MID = Math.floor(Math.random() * 99999)
  // query MIDs from firebase, document is 'main', collection is 'IDS', an array called MIDS is stored there
  // for prototype code, call it arr
  /*
  if (arr.indexOf(MID) == -1) { //unique value not found in array
    //push the number to MIDS array
  } else { //value does exist
    generateUniqueMID()
  } //recursive approach, is this viable?

  while (arr.indexOf(MID) == -1) { //alternatively, keep generating new IDs until a valid one is found
    MID = Math.floor(Math.random() * 99999);
    if (arr.indexOf(MID) != -1) {
      //push MID to MIDS array
      break;
    }
  }
  */
}

// alternatively, instead of querying random numbers from an ever-changing database, what if we hash the length of the array with something so that the value is always unique? postIDs are never deleted so the array will never be the decremented in size after a post is made.

/* Data flow will have to work on-demand.
Each device will need to be constantly open and able to accept connections from peers
(note: consider calling 'friends' on the app 'peers')
post ids will act as pointers
I envision how it will work is:
  peer requests post via post id ->
  peer sends post id over network ->
  host receives post id in a message over RTCDataChannel ->
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

// //WebRTC methods//

// let localConnection;
// let remoteConnection;
// let sendChannel;
// let receiveChannel;

// // until I can get Firebase working, https://switchboard.rtc.io COULD work as a decent signalling server

// var dataSettings = [
//   {
//     iceServers: [{url: 'stun.l.google.com:19302'}]
//   }
// ];
// var dataChannels = {};
// var pendingDataChannels = {};

/* alternatively, we could attempt for a TRUE serverless architecture using libp2p, although this is
 not incredibly well documented and may require an extra step (browserify) to allow for node
 modules to be used on the browser, or Android
 */

const THIS_PEER_ID = AsyncStorage.getItem('MID') // or whatever we do to reference stored MID

export async function initNode () {
  const node = await Libp2p.create({
    addresses: {
      // signalling server address(es), libp2p will attempt to dial the server to coordinate connection from fellow peers
      listen: [ // keep in mind below are public, testing servers, STILL NEED TO CONNECT TO FIREBASE
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ]
    },
    modules: {
      transport: [WebSockets, WebRTCStar],
      peerDiscovery: [Bootstrap],
      dht: KadDHT
    },
    config: {
      peerDiscovery: {
        [Bootstrap.tag]: {
          enabled: true,
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
          ],
        },
      },
      dht: {
        enabled: true,
      },
    },
  });

  node.on('peer:discovery', (peer) => {
    alert('Discovered %s', peer.id) //discovered peer
  })
  node.connectionManager.on('peer:connect', (connection) => {
    alert('Connected to %s', connection.remotePeer) //connected peer
  })
  await node.start()
}
