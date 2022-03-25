import React, { Component } from 'react'
import {Platform, StyleSheet, Text, View, Button} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { toggleRememberMe } from './User';

export default class LoginCheckboxComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: false //default to no autologin
        };
    }
    
    componentDidMount() {
        return
    }

    render () {
        return (
            <CheckBox
                disabled = {false}
                value = {this.state.value}
                onValueChange = {() => this.setState({ value: !value })}
            ></CheckBox>
        )
    }
}