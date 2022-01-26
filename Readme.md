# Mesosphere

Mesosphere is a P2P social media network that uses IDs to connect people and build networks via personal connections. Every individual is their own node and voluntarily builds networks of nodes in passing by others and expanding their networks. You only participate in networks and are exposed to nodes you choose. Data you post is stored and accessed via your phone, offloading the role of a central server across the entire network per each node on demand. Mesosphere will be aimed at iOS & Android, and released on Android via APK initially.

For more information, see https://github.com/SCCapstone/Mesosphere/wiki/Project-Description

We will be programming in accordance with [JavaScript Standard Style](https://standardjs.com/index.html).


## External Requirements

In order to build this project you first have to install:

* [Node.js](https://nodejs.org/en/)  
* [Expo CLI](https://docs.expo.dev/)  

Once you are in the project's root directory run `npm install --global expo-cli`.

## Setup

After cloning the repo and installing the above software, users should run `npm install` in the project's root directory, which will install all project dependencies listed in package.json.

## Running

To run the project, run `expo start` in the terminal.  This will bring the user to the Expo manager page.  From there, "Run in web browser" can be selected to the view the app in browser, or, run `expo start -w` to initially run with the project in the web browser. Users may install the [Expo Go](https://expo.dev/client) app to run it on their local mobile device (this requires an Expo account and to be logged in on both the host and mobile device).

# Deployment

To build an APK for the Android platform, run `expo build:android -t apk`, or to build an Android App Bundle, `expo build:android -t app-bundle`. 
If building an Android App Bundle, ensure that Google Play App Signing is enabled for your project, more information can be found [here](https://developer.android.com/guide/app-bundle).

# Testing

The unit tests are in `/test/unit`.

The behavioral tests are in `/test/behavioral/`.

## Testing Technology

Unit testing is done with the [Jest](https://jestjs.io) testing library.

## Running Tests

Unit tests are run with `npm run test`.

# Authors

Adam Gazdecki (gazdecki@email.sc.edu)  
Carleigh Gregory (cjg3@email.sc.edu)  
Cole Lewis (lewiscg@email.sc.edu)  
Divine Walker (divinew@email.sc.edu)  
Kevin Prince (ktprince@email.sc.edu)  

