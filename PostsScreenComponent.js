import React, { Component } from 'react';
import { ActivityIndicator, View, FlatList } from 'react-native';
import { styles, getUser} from './Utility';
import { Post, renderPost } from './Post'
import { pullAccountFromDatabase, pullPostFromDatabase } from './firebaseConfig'

export default class PostsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            error: null,
        };
    }

    componentDidMount() {
        //this.makeRemoteRequest();
        this.getAllPosts();
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
        for(const post of myPostsArr) {
            const FBpost = await pullPostFromDatabase(post.postID);
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
        //Logic for sorting by date goes here.
        //console.log(allPosts[0].timestamp);
        //const check = new Date(allPosts[0].timestamp);
        //console.log(check);
        allPosts.sort((b, a) =>
            (new Date(a.timestamp)) - (new Date(b.timestamp))
        )
        //console.log("All posts:" + JSON.stringify(allPosts));
    }



    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                    marginBottom: '5%',
                }}
            />
        );
    };

    render() {
        if(this.state.loading) {
            return (
                <ActivityIndicator size="large" color="#0000ff" />
            );
        } else {
            return (
              <FlatList
                data={this.state.data}
                renderItem={post => renderPost(post)}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={item => JSON.stringify(item)}
              />
            );
        }
    }
}