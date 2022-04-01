import React, { Component } from 'react'
import {Platform, StyleSheet, Text, View, Button} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default class LoginCheckboxComponent extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            value: false //default to no autologin
        };
    }

    async valCheck() {
        const val = await AsyncStorage.getItem('rememberMe')
        console.log("User is remembered for autologin by checkbox: " + val)
        return val
    }

    render () {
        return (
            <CheckBox
                disabled = {false}
                value = {this.state.value}
                onValueChange = {
                    () => { 
                        this.setState({ value: !this.state.value })
                        AsyncStorage.getItem('rememberMe').then(data => {
                            data = JSON.parse(data)
                            data = String(!this.state.value)
                            AsyncStorage.setItem('rememberMe', JSON.stringify(data))
                        })
                        this.valCheck()
                    }        
                }
            ></CheckBox>
        )
    }
}