import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { styles } from './Utility';
import logo from './assets/MesoSphere.png'
import { returnMIDSDatabaseArray } from './firebaseConfig'


export default class Friends extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            error: null,
        };

        this.arrayholder = [];
    }

    componentDidMount() {
        //this.makeRemoteRequest();
        this.fetchMiDs();
        //console.log(data);
    }

    async fetchMiDs() {
        data = await returnMIDSDatabaseArray();
    }

    makeRemoteRequest = () => {
        const url = `https://randomuser.me/api/?&results=20`;
        this.setState({ loading: true });

        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: res.results,
                    error: res.error || null,
                    loading: false,
                });
                this.arrayholder = res.results;
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

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
            const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
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
                        <TouchableOpacity onPress={() => alert('Item pressed!')}>
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
                                    }}>{`${item.name.first} ${item.name.last}`}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListFooterComponent={this.renderFooter}
                />
            </View>
        );
    }
}