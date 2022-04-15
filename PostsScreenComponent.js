import React, { Component } from 'react';
import { styles, getUser, COLORS } from './Utility';
import { View, FlatList, RefreshControl, Picker, Text } from 'react-native';
import { Post, renderPost } from './Post'
import { pullAccountFromDatabase, pullPostFromDatabase } from './firebaseConfig'

export default class PostsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            data: [],
            error: null,
            sortingMode: "Newest"
        };

        this.isRefreshing = false;
        this.flatlistRef = null;
    }

    componentDidMount() {
        //this.makeRemoteRequest();
        this.refresh();
        //console.log(data);
    }

    //All posts this user can see, including their peers and their own.
    async getAllPosts() {
        this.setState({loading: true});
        const allPosts = [];
        const currUser = getUser();
        //console.log("\\getAllPosts(): currUser: " + currUser.getMiD());
        //For each of my peers:
        for(const u of currUser.getAllPeers()) {
            const peer = await pullAccountFromDatabase(u);
            //console.log(peer.getMiD());
            //console.log(peer.getMyPosts());
            const peerPosts = peer.getMyPosts();
            //Reciprocity: If this peer also has me as a peer...
            //console.log("This peer:" + JSON.stringify(peer));
            //console.log("Peer's peers:" + peer.getAllPeers());
            if(peer.getAllPeers().includes(currUser.getMiD())) {
                //For each of their posts:
                for(const p of peerPosts) {
                    //Fetch the post from firebase using ID
                    console.log("Adding posts of peer: " + peer.getMiD())
                    const post = await pullPostFromDatabase(p);
                    allPosts.push(post);
                }
            }
        }
        //Do the same for current user:
        //TODO: This logic should be refactored so that local posts are also pulled from FB instead.
        //Local data is ONLY for P2P functionality.  It should not be used in this context while we are using firebase.
        const myPostsArr = currUser.getMyPosts();
        console.log(myPostsArr);
        for(const post of myPostsArr) {
            const FBpost = await pullPostFromDatabase(post);
            allPosts.push(FBpost);
        }
        //console.log("All posts:" + JSON.stringify(allPosts));
        //console.log(allPosts.includes(null))
        //console.log(allPosts[1] == null)
        if(true) {
            //console.log("Null value detected!");
            for(let i = 0;i < allPosts.length;++i) {
                //console.log("Post element at " + i + " is null! Replacing...");
                const dummyPost = new Post(0,('error-'+i),0,"Error: post not found!",Date().toString());
                if(allPosts[i] == null) {
                    allPosts[i] = dummyPost;
                }
            } 
        }
        //console.log("All posts:" + JSON.stringify(allPosts));
        this.sortPostsArray(allPosts);
        //Update the state
        this.setState({
            data: allPosts,
            error: null,
            loading: false,
        });
    }

    sortPostsArray(allPosts) {
        if(this.state.sortingMode == "Newest") {
            allPosts.sort((b, a) =>
                (new Date(a.timestamp)) - (new Date(b.timestamp))
            )
        } else if(this.state.sortingMode == "Oldest") {
            allPosts.sort((a, b) =>
                (new Date(a.timestamp)) - (new Date(b.timestamp))
            )
        } else if(this.state.sortingMode == "Score(H)") {
            allPosts.sort((b, a) =>
                (a.starting_score - b.starting_score)
            )
        } else if(this.state.sortingMode == "Score(L)") {
            allPosts.sort((a, b) =>
                (a.starting_score - b.starting_score)
            )
        } else if(this.state.sortingMode == "Weighted") {
            allPosts.sort((b, a) =>
                (((new Date(a.timestamp)) - (new Date(b.timestamp))) + ((a.starting_score - b.starting_score)*10000000))
            )
        }
    }



    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                    marginBottom: '3%',
                }}
            />
        );
    };

    render() {
        return (
            <View style={{marginTop: 0}}>
                <View style={{ marginTop: 0, height: 40, width: '45%', elevation: 2, position: 'absolute', borderRadius: 4, backgroundColor:'#181D27', alignSelf: 'flex-end'}}>
                    <Picker
                        selectedValue={this.state.sortingMode}
                        style={styles.PickerStyle}
                        mode='dropdown'
                        onValueChange={(itemValue, itemIndex) => {this.setState({sortingMode: itemValue});this.refresh()}}
                    >
                        <Picker.Item label="Date (Newest)" value="Newest" />
                        <Picker.Item label="Date (Oldest)" value="Oldest" />
                        <Picker.Item label="Score (Highest)" value="Score(H)" />
                        <Picker.Item label="Score (Lowest)" value="Score(L)" />
                        <Picker.Item label="Weighted" value="Weighted" />
                    </Picker>
                </View>
                <FlatList
                    ref={(ref) => this.flatlistRef = ref}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => {this.refresh()}}
                    />
                    }
                    data={this.state.data}
                    renderItem={post => renderPost(post)}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={item => JSON.stringify(item)}
                    />
                </View>
        );
    }

    refresh() {
        console.log("Refresh called...");
        if(!this.isRefreshing) {
            if(this.flatlistRef && this.state.data.length > 0) {
                this.flatlistRef.scrollToIndex({index: 0});
            }
            this.isRefreshing = true;
            this.setState({refreshing: true});
            console.log("Refreshing set to true!");
            //Do something
            this.getAllPosts();
            wait(800).then(() => {this.setState({refreshing: false});
                                    this.isRefreshing = false;
                                    console.log("Refreshing set to false!");});
        }
    }
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}