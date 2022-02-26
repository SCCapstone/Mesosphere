import React, { Component } from 'react';

export default class PostComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            displayname: "Loading...",
            score: 0,
            error: null,
        };
    }

}
