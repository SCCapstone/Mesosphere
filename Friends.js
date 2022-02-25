import React, { Component } from 'react';
import { Alert, View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { styles, getUser, setFocus, setScreen, PAGES } from './Utility';
import logo from './assets/MesoSphere.png'
import { returnMIDSDatabaseArray, pullAccountFromDatabase } from './firebaseConfig'


export default class Friends extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            error: null,
        };

        this.arrayholder = [];
        this.allIDs = [];
    }

    componentDidMount() {
        //this.makeRemoteRequest();
        this.fetchMiDs();
        //console.log(data);
    }

    async fetchMiDs() {
        this.setState({loading: true});
        this.allIDs = await returnMIDSDatabaseArray();
        if(getUser() == null) {
            console.log("Null getUser! (This is an error state)");
        }
        const myPeers = getUser().getAllPeers();
            
        for (const ID of this.allIDs) {
            console.log("Checking ID " + ID + " against list of peers:" + myPeers);
            //If this is one of of my peers and I haven't already counted them
            if(myPeers.includes(ID) && !(this.arrayholder.includes(ID))) {
                //Pull the peer from firebase
                const peer = await pullAccountFromDatabase(ID);
                console.log("Peer is found and exists.  Adding.");
                //If the peer exists...
               //Reciprocity: Check if this peer has ME
                if(peer.getAllPeers().includes(getUser().getMiD())) {
                    //Add them to the list!! :) my friend
                    this.arrayholder.push(peer.getDisplayName());
                }
            }
        }
        for (const Peer of myPeers) {
            //If the peer is does not exist (doesn't appear on firebase)
            if(!(this.allIDs.includes(Peer))) {
                console.log("Peer is null! Removing...");
                //Realistically, we should remove the peer from my list because it no longer exists (it cannot be restored)
                getUser().removePeer(Peer);
                //Don't add anything to the arrayholder list.  We're done!
            }
        }
        this.setState({
            data: this.arrayholder,
            error: null,
            loading: false,
        });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '86%',
                    backgroundColor: '#CED0CE',
                    marginLeft: '14%',
                }}
            />
        );
    };

    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        //If: There are no friends in the search field & ID exists & ID is not you
        if(newData.length == 0 && this.allIDs.length > 0 && text.length == 16 && this.allIDs.includes(text) &&
            text != getUser().getMiD()) {
            const dummyData = ["Add Friend " + text +  "?"];
            this.setState({
                data: dummyData,
            })
        } else {
            this.setState({
                data: newData,
            });
        }
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                color='#000000'
                lightTheme
                round
                onChangeText={text => this.searchFilterFunction(text)}
                value={this.state.value}
            />
        );
    };

    render() {
        return (
            <View style={styles.friendContainer}>
                <FlatList
                    ListHeaderComponent={this.renderHeader}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => this.itemTapped(item)}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 16,
                                    alignItems: 'center'
                                }}>
                                <Image
                                    source={logo}
                                    style={styles.friendsAvatar}
                                />
                                <Text
                                    category='s1'
                                    style={{
                                        textAlign: 'center',
                                        color: '#000'
                                    //}}>{`${item.name.first} ${item.name.last}`}
                                    }}>{`${item}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListFooterComponent={this.renderFooter}
                />
            </View>
        );
    }

    async itemTapped(item) {
        //alert('Item pressed! ' + item);
        if(item.includes("Add Friend")) {
            console.log(item.substring(11,27));
            const newFriendID = item.substring(11,27);
            Alert.alert(
                "Add Friend?",
                "Are you sure you want to add " + newFriendID + "?",
                [
                  {
                    text: "Cancel",
                    onPress: () => this.searchFilterFunction(""),//console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () =>  {getUser().addPeer(newFriendID); this.fetchMiDs();this.searchFilterFunction("");}}
                ]
              );
        } else {
            console.log("Real item pushed! Should move to User screen.");
            //Construct a User object from item using Firebase
            const u = await pullAccountFromDatabase(item);
            //Set that user object to our "current focus"
            setFocus(u);
            console.log(u.getDisplayName());
            //Set the screen to the 'View Friend' screen (which uses our focus to generate display)
            setScreen(PAGES.FRIEND);
        }
    }
}