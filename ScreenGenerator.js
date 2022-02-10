import React from 'react'
import { Alert, Text, TextInput, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import { PAGES, styles, setScreen, getUser, setUser } from './Utility'
import { checkLogin, makeAcc, adminButton, deleteCurrUser, makeAdminAcc, makeDemoAcc } from './User'
import { renderPost, savePost } from './Post'

import FriendPage from './Friends'
import logo from './assets/MesoSphere.png'
import { atom } from 'elementos'
import { FlatList } from 'react-native-gesture-handler'

const username$ = atom('')
const password$ = atom('')
const newUsername$ = atom('')
const newPassword$ = atom('')
const newDispname$ = atom('')
const newBiography$ = atom('')

export class ScreenGenerator {
  constructor () {
    this.page = -1
    this.output = (<View style={styles.container}><Text>No screen selected.</Text></View>)
    makeAdminAcc()
    makeDemoAcc()
    setScreen(PAGES.LOGIN)
  }

  selectScreen (input) {
    this.page = input
    this.generateScreen()
  }

  generateScreen () {
    console.log('Generating: ' + this.page)
    if (this.page === PAGES.LOGIN) {
      this.output = (
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder='Username.'
              placeholderTextColor='#003f5c'
              returnKeyType='next'
              maxLength={30}
              onChangeText={(username) => username$.actions.set(username)}
              testID='LoginUserPrompt'
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder='Password.'
              placeholderTextColor='#003f5c'
              secureTextEntry
              returnKeyType='done'
              maxLength={50}
              onChangeText={(password) => password$.actions.set(password)}
              testID='LoginPassPrompt'
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => checkLogin(String(username$.get()), String(password$.get()))}
            testID='LoginButton'
          >
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => setScreen(PAGES.MAKEACC)}
            testID='RegisterButton'
          >
            <Text style={styles.loginText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (this.page === PAGES.MAKEACC) {
      newUsername$.actions.set(username$.get())
      newPassword$.actions.set(password$.get())
      this.output = (
        <View style={styles.container}>
          <Text>Please enter your information.</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder='Username.'
              placeholderTextColor='#003f5c'
              returnKeyType='next'
              maxLength={30}
              onChangeText={(newusername) => newUsername$.actions.set(newusername)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder='Password.'
              placeholderTextColor='#003f5c'
              secureTextEntry
              returnKeyType='next'
              maxLength={50}
              onChangeText={(newpassword) => newPassword$.actions.set(newpassword)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder='Display Name.'
              placeholderTextColor='#003f5c'
              returnKeyType='next'
              maxLength={30}
              onChangeText={(newdispname) => newDispname$.actions.set(newdispname)}
            />
          </View>
          <View style={styles.inputViewBio}>
            <TextInput
              multiline
              numberOfLines={3}
              style={styles.TextInput}
              placeholder='Enter a short biography!'
              placeholderTextColor='#003f5c'
              returnKeyType='done'
              blurOnSubmit
              maxLength={240}
              onChangeText={(biography) => newBiography$.actions.set(biography)}
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => makeAcc(String(newUsername$.get()), String(newPassword$.get()), String(newDispname$.get()), String(newBiography$.get()))}
          >
            <Text style={styles.loginText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => setScreen(PAGES.LOGIN)}
          >
            <Text style={styles.loginText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (this.page === PAGES.ACCOUNTPAGE) {
      const u = getUser()
      this.output = (
        <View style={styles.container}>
          <Text style={styles.bigText}>Welcome back, {u.realName}</Text>
          <Text style={styles.text}>{u.getMiD()}</Text>
          {adminCheck()}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setUser(null)
              setScreen(PAGES.LOGIN)
            }}
          >
            <Text style={styles.loginText}>LOGOUT</Text>
          </TouchableOpacity>
          {this.generateBottomBar(1)}
        </View>
      )
    } else if (this.page === PAGES.FRIENDSLIST) {
      this.output = (
        <>
          <SafeAreaView style={styles.container}>
            <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: '#fff', marginBottom: '25%' }}>
              <FriendPage />
            </SafeAreaView>
            {this.generateBottomBar(3)}
          </SafeAreaView>
        </>
      )
    } else if (this.page === PAGES.MAKEPOST) {  // "New Post" page.
      // TODO(Gazdecki) Figure out what this does exactly.
      const postText$ = atom('')
      this.output = (
        <View style={styles.container}>
          {/**Large Title above text box. */}
          <Text style={styles.bigText}> New Post </Text>
          <View style={styles.inputViewBio}>
            <TextInput
              multiline
              numberOfLines={3}
              style={styles.TextInput}
              placeholder='Insert Text Here'
              placeholderTextColor='#003f5c'
              returnKeyType='done'
              blurOnSubmit
              maxLength={240}
              onChangeText={(post) => postText$.actions.set(post)}
            />
          </View>
          {/**"Add Media" button. */}
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => alert('Still in development!')}
          >
            <Text
              style={styles.buttonText}
            >Adding images and videos are still a work in progress!
            </Text>
          </TouchableOpacity>
          {/**"Save Post" button. */}
          <TouchableOpacity
            style={styles.postBtn} onPress={
              () => { savePost(String(postText$.get()), null) }
            }
          >
            <Text style={styles.buttonText}> Click to Post! </Text>
          </TouchableOpacity>
          {/**Generates bottom bar at all times on page. */}
          {this.generateBottomBar(4)}
        </View>
      )  // End of `this.output =`.
    // End of "New Post" page.
    } else if (this.page === PAGES.VIEWPOSTS) { // AKA "Network" page currently.
      // TODO(Gazdecki) We need the bottom bar to sit ontop of a scrolling page. Like an embedded scroll bar.
      // e.g. If there are lots of posts in the network page, you have to scroll past alllllllll of them to get to the bottom bar again...
      // TODO(Gazdecki) Speaking of which the bottom bar changes hight in the webpage rendering. Network and Friends do it alone...
      console.log('Fetching Post Array...')
      const postsArray = getUser().getAllPosts()
      console.log('Array of Posts' + postsArray)
      this.output = (
        <> {/**Really JSX? You need a blank opener here?*/}
          {/**This is the page. Notice the bottom bar just inside this level. */}
          <SafeAreaView style={styles.container}>
            {/**Big list of posts. */}
            <SafeAreaView style={styles.postViewContainer}>
              {/**Individual posts, see ./Post.js */}}
              <FlatList
                data={postsArray}
                renderItem={post => renderPost(post)}
                keyExtractor={post => post.postID}
              />
              {/**Vote Button. */}
              {/**TODO(Gazdecki) This button does not duplicate with each post correctly. */}
              {/**TODO(Gazdecki) This button appears without any posts there. */}
              {/**TODO(Gazdecki) There is a stray closing curly bracket at the top of the page. */}
              {/**TODO(all) Sometimes the bottom bar breaks. Need to find way to reproduce. */}
              <TouchableOpacity
                style={styles.postBtn} onPress={
                  () => { savePost(String(postText$.get()), null) }
                }
              >
                <Text style={styles.buttonText}> Vote </Text>
              </TouchableOpacity>
            </SafeAreaView>
            {this.generateBottomBar(2)}
          </SafeAreaView>
        </>
      )
    } // End of view posts page.
  } // End of generateScreen.

  generateBottomBar (currentSlice) {
    if (currentSlice === 1) {
      return (
        <View style={styles.bottomButtomBar}>
          <TouchableOpacity style={styles.userButtonSelected}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.networkButton}
            onPress={() => { setScreen(PAGES.VIEWPOSTS) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.friendButton}
            onPress={() => { setScreen(PAGES.FRIENDSLIST) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => { setScreen(PAGES.MAKEPOST) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (currentSlice === 2) {
      return (
        <View style={styles.bottomButtomBar}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => { setScreen(PAGES.ACCOUNTPAGE) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.networkButtonSelected}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.friendButton}
            onPress={() => { setScreen(PAGES.FRIENDSLIST) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => { setScreen(PAGES.MAKEPOST) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (currentSlice === 3) {
      return (
        <View style={styles.bottomButtomBar}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => { setScreen(PAGES.ACCOUNTPAGE) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.networkButton}
            onPress={() => { setScreen(PAGES.VIEWPOSTS) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendButtonSelected}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => { setScreen(PAGES.MAKEPOST) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (currentSlice === 4) {
      return (
        <View style={styles.bottomButtomBar}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => { setScreen(PAGES.ACCOUNTPAGE) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.networkButton}
            onPress={() => { setScreen(PAGES.VIEWPOSTS) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.friendButton}
            onPress={() => { setScreen(PAGES.FRIENDSLIST) }}
          >
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButtonSelected}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render () {
    return this.output
  }
}

function adminCheck () {
  const u = getUser()
  if (u != null && u.getUsername() === 'admin') {
    return (
      <TouchableOpacity
        onPress={() => { adminButton() }}
        style={styles.loginBtn}
      >
        <Text style={styles.buttonText}>Delete ALL Data</Text>
      </TouchableOpacity>
    )
  } else if (u != null) {
    return (
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => deleteCurrUser()}
      >
        <Text style={styles.loginText}>Delete My Data</Text>
      </TouchableOpacity>
    )
  }
}

let instance

export function getInstance () {
  if (instance == null) {
    instance = new ScreenGenerator()
    console.log('New SG generated.')
  }
  return instance
}

export default ScreenGenerator
