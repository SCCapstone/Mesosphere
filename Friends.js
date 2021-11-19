import React from 'react';
import AsyncStorage, { Text, Image } from 'react-native'
import { styles } from './Utility';
import pic from './assets/MesoSphere.png'

export class Friends {
    constructor (friendNames) {
        this.friendNames = friendNames
    }
}

export default Friends;

export function friendsPage () {
    return(
        <>
        <Image source={pic} style={styles.friendsLogo} />
        <Text style={styles.friendsLabel}> Friends</Text>
        </>

    )
}