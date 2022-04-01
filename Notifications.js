import React, { Component } from 'react';
import { ActivityIndicator, Alert, View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import { styles, getUser, setScreen, PAGES } from './Utility';
import backBtn from './assets/BackBtn.png'
import { pullNotifications, getDisplayNameFromMID, addPeerToDatabase, removeNotification } from './firebaseConfig';

export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            notifs: [],
            error: null
        };
    }

    componentDidMount() {
        this.fetchNotifications();
    }

    async fetchNotifications() {
        const nlist = await pullNotifications(getUser());
        console.log(nlist);
        console.log(nlist.size)
        this.setState({loading: true});
        if(getUser() == null) {
            console.log("Null getUser! (This is an error state)");
            this.setState({error: 1});
        }
        if (nlist == null) {
            this.setState({
                loading: false,
                notifs: [],
                error: 2
            })
        } else {
            this.setState({
                notifs: nlist,
                loading: false,
                error: 0
            });
            console.log("Notifs loaded: " + this.state.notifs + ", error: " + this.state.error);
        }
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

    render () {
        if(this.state.error == 1) {
            return (
                <View style={styles.friendContainer}>
                    <Text>Error: Current user is undefined or null. Please make sure you are logged in or have an internet connection.</Text>
                </View>
            )
        } 
        if(this.state.error == 2) {
            return (
                <View style={styles.friendContainer}>
                    <Text>There are no new notifications!</Text>
                </View>
            )
        }
        if(this.state.loading) {
            return (
                <ActivityIndicator size="large" color="#0000ff" />
            );
        } else {
            return (
                <View style={styles.friendContainer}>
                    <FlatList
                        data = {this.state.notifs}
                        renderItem = {({item}) => (
                            <TouchableOpacity onPress = {() => this.expanded(item)}>
                                <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center'}}>
                                    <Text>The user { item } wants to be your friend!</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent = {this.renderSeparator}
                    />
                </View>
            )
        }
    }

    async expanded (item) {
        const displayname = await getDisplayNameFromMID(item)
        Alert.alert (
            "You were sent a friend request!",
            "Would you like to add " + displayname + " (" + item + ") back and become friends?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        getUser().addPeer(item);
                        //Remove it from firestore
                        removeNotification(getUser(), item);
                        //Remove it locally
                        this.setState( {notifs: this.state.notifs.filter(function(found) {
                                return found !== item}) });
                    }
                },
                {
                    text: "No, delete the notification.",
                    onPress: () => {
                        //Remove it from firestore
                        removeNotification(getUser(), item);
                        //Remove it locally
                        this.setState({notifs: this.state.notifs.filter(function(found) {
                                return found !== item}) });
                    },
                    style: "cancel"
                },
                {
                    text: "Ignore" 
                }
            ]
        );
    }
}