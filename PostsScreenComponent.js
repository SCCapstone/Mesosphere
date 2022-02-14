import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { styles, getUser} from './Utility';
import { renderPost } from './Post'
import { pullAccountFromDatabase, pullPostFromDataBase } from './firebaseConfig'

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
        console.log("\\getAllPosts(): currUser: " + currUser.getMiD());
        //For each of my peers:
        for(const u of currUser.getAllPeers()) {
            const peer = await pullAccountFromDatabase(u);
            console.log(peer.getMiD());
            console.log(peer.getMyPosts());
            const peerPosts = peer.getMyPosts();
            //For each of their posts:
            for(const p of peerPosts) {
                //Fetch the post from firebase using ID
                const post = await pullPostFromDataBase(p);
                allPosts.push(post);
            }
        }
        //Do the same for current user:
        const myPostsArr = currUser.getMyPosts();
        for(const post of myPostsArr) {
            allPosts.push(post);
        }
        console.log("All posts:" + JSON.stringify(allPosts));
        //Update the state
        this.setState({
            data: allPosts,
            error: null,
            loading: false,
        });
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