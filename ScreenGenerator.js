import React, {useState} from 'react'
import { Alert, Text, TextInput, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import { PAGES, styles, setScreen, getUser, setUser, getFocus, storeData, removeValue } from './Utility'
import { dataOccupied, makeAcc, deleteCurrUser, lru, getRememberMe, checkLogin } from './User'
import { renderPost, savePost } from './Post'
import { changeUserBiographyInDatabase, changeUserDisplayNameInDatabase, pullPostFromDatabase } from './firebaseConfig'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { sha224 } from 'js-sha256'

import FriendPage from './Friends'
import PostsPage from './PostsScreenComponent'
import logo from './assets/MesoSphere.png'
import backBtn from './assets/BackBtn.png'
import friends from './assets/friends.png'
import plussign from './assets/plussign.png'
import networking from './assets/networking.png'
import persons from './assets/persons.png'
import { atom } from 'elementos'
import { FlatList } from 'react-native-gesture-handler'
import LoginCheckboxComponent from './LoginCheckboxComponent'

const username$ = atom('')
const password$ = atom('')
const newUsername$ = atom('')
const newPassword$ = atom('')
const newDispname$ = atom('')
const newBiography$ = atom('')

export class ScreenGenerator {
  constructor() {
    this.page = -1
    this.output = (<View style={styles.container}><Text>No screen selected.</Text></View>)
    setScreen(PAGES.LOGIN)
  }

  selectScreen(input) {
    this.page = input
    this.generateScreen()
  }

  async remembranceCheck() {
    const val = await AsyncStorage.getItem('rememberMe')
    console.log("User is remembered for autologin: " + val)
    return val
  }

  generateScreen() {
    console.log('Generating: ' + this.page)
    if (this.page === PAGES.LOGIN) {
      if (AsyncStorage.getItem('lastRememberedUser') !== null /*&& this.remembranceCheck() != "false"*/) { //last remembered user does exist
        lru()
      }
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

          {/* checkbox goes here */}
          <Text style={styles.loginText}>Remember me?</Text>
          <LoginCheckboxComponent></LoginCheckboxComponent>

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
          {/* {adminCheck()} */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              removeValue('lastRememberedUser')
              AsyncStorage.setItem('rememberMe', 'false')
              setUser(null)
              setScreen(PAGES.LOGIN)
            }}
          >
            <Text style={styles.loginText}>LOGOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.SETTINGS)
            }}
          >
            <Text style={styles.loginText}>Settings</Text>
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
    } else if (this.page === PAGES.FRIEND) {
      const u = getFocus();
      this.output = (
        <View style={styles.container}>
          <Text style={styles.bigText}>{u.getDisplayName()}</Text>
          <Text style={styles.smallText}>{u.getMiD()}</Text>
          <Text style={styles.text}>{u.getBiography()}</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              //Remove friend
              getUser().removePeer(u.getMiD())
              setScreen(PAGES.FRIENDSLIST);
            }}
          >
            <Text style={styles.loginText}>REMOVE FRIEND</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.FRIENDSLIST);
            }}
          >
            <Text style={styles.loginText}>BACK</Text>
          </TouchableOpacity>
          {this.generateBottomBar(3)}
        </View>
      )
    } else if (this.page === PAGES.MAKEPOST) {
      const postText$ = atom('')
      this.output = (
        <View style={styles.container}>
          <Text style={styles.bigText}> New Post </Text>
          <View style={styles.inputViewBio}>
            <TextInput
              multiline
              numberOfLines={3}
              style={styles.TextInput}
              placeholder='Posts consist of plaintext and only text, at the moment.'
              placeholderTextColor='#003f5c'
              returnKeyType='done'
              blurOnSubmit
              maxLength={240}
              onChangeText={(post) => postText$.actions.set(post)}
            />
          </View>
          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={() => alert('Still in development!')}
          >
            <Text
              style={styles.buttonText}
            >Add Media
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postBtn} onPress={
              () => { savePost(String(postText$.get())) }
            }
          >
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableOpacity>
          {this.generateBottomBar(4)}
        </View>
      )
    } else if (this.page === PAGES.VIEWPOSTS) {
      this.output = (
        <>
          <SafeAreaView style={styles.container}>
          <SafeAreaView style={styles.postViewContainer}>
              <PostsPage/>
            </SafeAreaView>
            {this.generateBottomBar(2)}
          </SafeAreaView>
        </>
      )
    } else if (this.page === PAGES.SETTINGS) {
      console.log('Switching to Settings Page...')
      const u = getUser()

      this.output = (
        <View style={styles.container}>
          <SafeAreaView style={{marginBottom: '20%', width: '90%', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
          style={styles.backBtnLoc}
          onPress={() => { setScreen(PAGES.ACCOUNTPAGE) } }
        >
          <Image source={backBtn} style={styles.backBtn} />
        </TouchableOpacity>
          <Text style={styles.bigText}>{u.realName}</Text>
          <Text style={styles.text}>{u.getMiD()}</Text>
          {/* {adminCheck()} */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.VIEW_LOCAL_DATA)
            }}
          >
            <Text style={styles.loginText}>View Local Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.CHANGEACCOUNT_DISP)
            }}
          >
            <Text style={styles.loginText}>Change Display Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.CHANGEACCOUNT_PASS)
            }}
          >
            <Text style={styles.loginText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.CHANGEACCOUNT_BIO)
            }}
          >
            <Text style={styles.loginText}>Change Bio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setUser(null)
              setScreen(PAGES.LOGIN)
            }}
          >
            <Text style={styles.loginText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => deleteCurrUser()}
          >
            <Text style={styles.loginText}>Delete This Account</Text>
          </TouchableOpacity>
          </SafeAreaView>
          {this.generateBottomBar(1)}
          </View>
      )
    } else if (this.page === PAGES.CHANGEACCOUNT_DISP) {
      console.log('changing some aspect of the account (user)')
      const u = getUser()
      this.output = (
        <View style={styles.container}>
          <TouchableOpacity
          style={styles.backBtnLoc}
          onPress={() => { setScreen(PAGES.SETTINGS) } }
        >
          <Image source={backBtn} style={styles.backBtn} />

        </TouchableOpacity>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder='New Display Name'
                placeholderTextColor='#003f5c'
                returnKeyType='next'
                maxLength={30}
                onChangeText={(newusername) => newUsername$.actions.set(newusername)} />
              </View>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={ () => {
                  changeUserDisplayNameInDatabase(u.MiD, String(newUsername$.get()))
                  u.setRealName(String(newUsername$.get()))
                  AsyncStorage.getItem(u.MiD).then(data => {
                    data = JSON.parse(data)
                    data.realName = String(newUsername$.get())
                    AsyncStorage.setItem(u.MiD, JSON.stringify(data))
                  })

                  setScreen(PAGES.SETTINGS)
                  } 
                }
              >
                <Text style={styles.loginText}>Change Display Name</Text>
              </TouchableOpacity>
          </View>
      )
    } else if (this.page === PAGES.CHANGEACCOUNT_PASS) {
      console.log('changing some aspect of the account (pass)')
      const u = getUser()
      this.output = (
        <View style={styles.container}>
          <TouchableOpacity
          style={styles.backBtnLoc}
          onPress={() => { setScreen(PAGES.SETTINGS) } }
        >
          <Image source={backBtn} style={styles.backBtn} />

        </TouchableOpacity>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder='New Password'
                placeholderTextColor='#003f5c'
                secureTextEntry
                returnKeyType='next'
                maxLength={50}
                onChangeText={(newpassword) => newPassword$.actions.set(newpassword)} />
              </View>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  u.setNewPassword(String(sha224(String(newPassword$.get()))))
                  AsyncStorage.getItem(u.MiD).then(data => {
                    data = JSON.parse(data)
                    data.password = String(sha224(String(newPassword$.get())))
                    AsyncStorage.setItem(u.MiD, JSON.stringify(data))
                  })
                  setScreen(PAGES.SETTINGS)
                } }
              >
                <Text style={styles.loginText}>Change Password</Text>
              </TouchableOpacity>
          </View>
      )
    } else if (this.page === PAGES.CHANGEACCOUNT_BIO) {
      console.log('changing some aspect of the account (bio)')
      const u = getUser()
      this.output = (
       <View style={styles.container}>
         <TouchableOpacity
          style={styles.backBtnLoc}
          onPress={() => { setScreen(PAGES.SETTINGS) } }
        >
          <Image source={backBtn} style={styles.backBtn} />

        </TouchableOpacity>
            <View style={styles.inputViewBio}>
              <TextInput
                multiline
                numberOfLines={3}
                style={styles.TextInput}
                placeholder='New Bio'
                placeholderTextColor='#003f5c'
                returnKeyType='done'
                blurOnSubmit
                maxLength={240}
                onChangeText={(biography) => newBiography$.actions.set(biography)} />
              </View>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  changeUserBiographyInDatabase(u.MiD, String(newBiography$.get()))
                  u.setNewBiography(String(newBiography$.get()))
                  AsyncStorage.getItem(u.MiD).then(data => {
                    data = JSON.parse(data)
                    data.bio = String(newBiography$.get())
                    AsyncStorage.setItem(u.MiD, JSON.stringify(data))
                  })
                  setScreen(PAGES.SETTINGS)
                } }
              >
                <Text style={styles.loginText}>Change Bio</Text>
              </TouchableOpacity>
          </View>
      )
    } else if (this.page === PAGES.VIEW_LOCAL_DATA) {
      console.log('This is the Local Data Page')
      const u = getUser()

      // AsyncStorage.getItem(u.MiD).then(data => {
      //   data = JSON.parse(data)
      //   let myRemotePostData = []
      //   for (let i = 0; i < u.getMyPosts().length; i++) {
      //     data.myPosts[i] = pullPostFromDatabase(u.myPosts[i].postID)
      //   }
      //   AsyncStorage.setItem(u.MiD, JSON.stringify(data))
      // })

      const personalPosts = u.getMyPosts()
      this.output = (
        <View style={styles.container}>
          <TouchableOpacity
          style={styles.backBtnLoc}
          onPress={() => { setScreen(PAGES.SETTINGS)} }
        >
          <Image source={backBtn} style={styles.backBtn} />
        </TouchableOpacity>


        <SafeAreaView style={styles.container}>
          <SafeAreaView style={styles.postViewContainer}>
            <FlatList
              data={personalPosts}
              renderItem={post => renderPost(post)}
              keyExtractor={post => post.postID}
            />
          </SafeAreaView>
          <Text>{ "Size of post data:  " + dataOccupied(u) + " bytes." }</Text>
        </SafeAreaView>


        </View> 
      )
    }

  }

  generateBottomBar(currentSlice) {
    if (currentSlice === 1) {
      return (
        <View style={styles.bottomButtomBar}>
          <TouchableOpacity
            style={styles.userButtonSelected}
            onPress={() => { setScreen(PAGES.ACCOUNTPAGE) }}
          ></TouchableOpacity>
            <Image source={logo} style={styles.bottomButtonIcon} />
          <TouchableOpacity style={styles.userButtonSelected}>
            <Image source={persons} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.networkButton}
            onPress={() => { setScreen(PAGES.VIEWPOSTS) }}
          >
            <Image source={networking} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.friendButton}
            onPress={() => { setScreen(PAGES.FRIENDSLIST) }}
          >
            <Image source={friends} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => { setScreen(PAGES.MAKEPOST) }}
          >
            <Image source={plussign} style={styles.bottomButtonIcon} />
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
            <Image source={persons} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.networkButtonSelected}>
            <Image source={networking} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.friendButton}
            onPress={() => { setScreen(PAGES.FRIENDSLIST) }}
          >
            <Image source={friends} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => { setScreen(PAGES.MAKEPOST) }}
          >
            <Image source={plussign} style={styles.bottomButtonIcon} />
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
            <Image source={persons} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.networkButton}
            onPress={() => { setScreen(PAGES.VIEWPOSTS) }}
          >
            <Image source={networking} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendButtonSelected}>
            <Image source={friends} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => { setScreen(PAGES.MAKEPOST) }}
          >
            <Image source={plussign} style={styles.bottomButtonIcon} />
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
            <Image source={persons} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.networkButton}
            onPress={() => { setScreen(PAGES.VIEWPOSTS) }}
          >
            <Image source={networking} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.friendButton}
            onPress={() => { setScreen(PAGES.FRIENDSLIST) }}
          >
            <Image source={friends} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButtonSelected}>
            <Image source={plussign} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return this.output
  }
}

let instance

export function getInstance() {
  if (instance == null) {
    instance = new ScreenGenerator()
    console.log('New SG generated.')
  }
  return instance
}

export default ScreenGenerator
