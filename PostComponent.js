import React, { Component } from 'react';
import { View, Text, Button } from 'react-native'
import { alterPostScore } from './firebaseConfig'
import {styles} from './Utility'

export default class PostComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            displayname: "Loading...",
            score: 0,
            error: null,
        };

        this.postObj = props.postObj;
    }

    componentDidMount () {
        this.loadData()
    }

    async loadData () {
        this.setState({ 
            score: this.postObj.starting_score,
          });
        //Put fetching display name (and potentially score?) here.
    }

    updateScore (change) {
        this.postObj.starting_score += change;
        this.setState({ 
            score: this.postObj.starting_score,
        });
        console.log("Upvote button pressed, score is now: " + this.state.score + ".")
        if(change > 0) {alterPostScore(this.postObj.postID, 0.5)} else {alterPostScore(this.postObj.postID, -0.5)}
    }

  render () {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postContainerUsername}>{this.state.displayname} </Text>
        <View style={{borderBottomColor: 'black',
                      borderBottomWidth: 1,}}/>
        <Text style={styles.postContainerText}>{this.postObj.textContent} </Text>
        <Text style={styles.postContainerText}>{this.postObj.timestamp} </Text>
        <View style={styles.scoreButtonStyle}>
          <View style={styles.scoreButton}/>
            <Button
                onPress={() => {this.updateScore(1)}}
                title="Like"
                color="#254D32"
                borderRadius='12'
            />
          <View style={styles.spacing}/>
          <View style={styles.scoreButton}/>
            <Button
                onPress={() => {this.updateScore(-1)}}
                title="Dislike"
                color="#3A7D44"
            />
          <View style={styles.spacing}/>
          <Text style={styles.postContainerText}>{this.state.score}</Text>
          <View style={styles.spacing}/>        
        </View>
      </View>
    )
  }

}
