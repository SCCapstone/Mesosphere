import React, { Component, View, Text } from 'react'

export class ScreenGenerator extends Component {
    output = "None";
    constructor() {
        super();
    }

    generateScreen(input) {
        this.output = input;
    }

    render() {
        return this.output;
    }
}

export default ScreenGenerator
