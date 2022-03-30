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
        this.setState({loading: true});
        if(getUser() == null) {
            console.log("Null getUser! (This is an error state)");
            this.setState({error: "Error: Current user is undefined or null. Please make sure you are logged in or have an internet connection."});
        }
        if (nlist.size === 0) {
            this.setState({
                loading: false,
                notifs: [],
                error: "Error: There are no notifications!"
            })
        } else {
            this.setState({
                notifs: nlist,
                loading: false,
                error: null
            });
            console.log("Notifs loaded: " + this.state.notifs);
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
        if(this.state.loading) {
            return (
                <ActivityIndicator size="large" color="#0000ff" />
            );
        } else {
            return (
                <View style={styles.friendContainer}>
                    <TouchableOpacity style={styles.backBtnLoc} onPress={() => { setScreen(PAGES.FRIENDSLIST) } }>
                        <Image source={backBtn} style={styles.backBtn} />
                    </TouchableOpacity>
                    <FlatList
                        //ListHeaderComponent = {}
                        data = {this.state.notifs}
                        renderItem = {({item}) => (
                            <TouchableOpacity onPress = {() => this.expanded(item)}>
                                <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center'}}>
                                    <Text>The user { item } wants to be your friend!</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent = {this.renderSeparator}
                        //ListFooterComponent = {}
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
                        addPeerToDatabase(getUser(), item);
                        removeNotification(getUser(), item);
                        // setScreen(PAGES.NOTIFICATIONS)
                    }
                },
                {
                    text: "No, delete the notification.",
                    onPress: () => {
                        removeNotification(getUser(), item);
                        // setScreen(PAGES.NOTIFICATIONS) 
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