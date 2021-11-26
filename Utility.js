import AsyncStorage from '@react-native-async-storage/async-storage'
// import Libp2p from 'libp2p'
// import WebSockets from 'libp2p-websockets'
// import WebRTCStar from 'libp2p-webrtc-star'
// import KadDHT from 'libp2p-kad-dht' // to be used in best case
// import Bootstrap from 'libp2p-bootstrap'
import { sha224 } from 'js-sha256'
import { returnMIDSDatabaseLength, returnPostIDDatabaseLength, pushMIDToDatabase, pushPostIDToDatabase } from './firebaseConfig.js'

export function generateUniqueMID () {
  const magicNumber = returnMIDSDatabaseLength + (Math.random() * 1)
  const ID = 'meso-' + String(sha224(magicNumber)).substring(0, 11) // will always be random since we're hashing array length in an immutable array, using 224 for smaller footprint
  AsyncStorage.setItem('MID', ID)
  pushMIDToDatabase(ID)
  return ID
}

export function generatePostID () {
  const magicNumber = returnPostIDDatabaseLength + (Math.random() * 1)
  const ID = String(sha224(magicNumber))
  pushPostIDToDatabase(ID)
  return ID // this value is to be used when creating a new post! also should be added to the current User's array of post IDs
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

// export async function initNode () { // can be extracted
//   const node = await Libp2p.create({
//     addresses: {
//       // signalling server address(es), libp2p will attempt to dial the server to coordinate connection from fellow peers
//       listen: [ // keep in mind below are public, testing servers, STILL NEED TO CONNECT TO FIREBASE
//         '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
//         '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
//         '/ip4/127.0.0.1/tcp/8000/ws'
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
//     console.log('Discovered %s', peer.id) // discovered peer
//   })
//   node.connectionManager.on('peer:connect', (connection) => {
//     console.log('Connected to %s', connection.remotePeer) // connected peer
//   })
//   await node.start()
// }
