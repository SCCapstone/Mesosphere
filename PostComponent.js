import React, { Component } from 'react';
import { View, Text, Button } from 'react-native'
import { alterPostScore, pullAccountFromDatabase, removeInteraction } from './firebaseConfig'
import { getUser, styles } from './Utility'

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
            displayname: this.postObj.attachedMiD,
            score: this.postObj.starting_score,
        });
        console.log("Pulling info on this poster...");
        const poster = await pullAccountFromDatabase(this.postObj.attachedMiD);
        if(poster == null) {
            console.log("Pulled account was null! This is an error state.")
            return;
        }
        this.setState({ 
            displayname: poster.realName,
        });
    }

    async updateScore (change) {
        //Check if this user has already interacted
        for (const entry of [...this.postObj.interactedUsers]) {
            //If they have...
            if(entry.user == getUser().MiD) {
                //If they have already made this interaction
                if((entry.action == "like" && change > 0) || (entry.action == "dislike" && change < 0)) {
                    //TODO: Update this code to remove the interaction instead (I think it'll confusing without the buttons changing)
                    await removeInteraction(getUser(), this.postObj.postID)
                    console.log("This user has already interacted! Removing old interaction...");
                    if(entry.action == "like") {
                        console.log("Old score: " + this.postObj.starting_score);
                        await alterPostScore(getUser(), this.postObj.postID, -1);
                        console.log("About to subtract 1.");
                        this.postObj.starting_score += -1;
                        console.log("New score: " + this.postObj.starting_score);
                        this.setState({ 
                            score: this.postObj.starting_score,
                        });
                    } else {
                        console.log("Old score: " + this.postObj.starting_score);
                        await alterPostScore(getUser(), this.postObj.postID, 1);
                        this.postObj.starting_score += 1;
                        console.log("New score: " + this.postObj.starting_score);
                        this.setState({ 
                            score: this.postObj.starting_score,
                        });
                    }
                    await removeInteraction(getUser(), this.postObj.postID);
                    //Remove the interaction locally
                    this.postObj.interactedUsers = this.postObj.interactedUsers.filter(
                        int => int.user != entry.user
                    );
                    return;
                } else {
                    //Remove the old interaction.  The rest of the code runs as normal.
                    await removeInteraction(getUser(), this.postObj.postID);
                    //Flip the interaction internally
                    console.log("Flipping internally...");
                    if(entry.action == "like") {entry.action = "dislike";change--} else {entry.action = "like";change++};
                }
            }
        }
        console.log(JSON.stringify(this.postObj.interactedUsers));
        this.postObj.starting_score += change;
        this.setState({ 
            score: this.postObj.starting_score,
        });
        console.log("Upvote button pressed, score is now: " + this.postObj.starting_score + ". (change:" + change )
        await alterPostScore(getUser(), this.postObj.postID, change);
        //Add it locally too, if its' the first interaction
        if(!(JSON.stringify(this.postObj.interactedUsers).includes(getUser().MiD))) {
            console.log("Adding entry locally!");
            var action;
            if(change > 0) {action = "like"} else {action = "dislike"};
            function interactionFormat() {
                this.user = getUser().MiD,
                this.action = action
            }
            var currentInteraction = new interactionFormat();
            this.postObj.interactedUsers.push(currentInteraction)
        }
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
