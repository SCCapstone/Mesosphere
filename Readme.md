# Mesosphere

Mesosphere is a social media network that uses IDs to connect people and build networks via personal connections. Every individual is their own node and voluntarily builds networks of nodes in passing by others and expanding their networks. You only participate in networks and are exposed to nodes you choose. Data you post is stored on a firebase central server, with the hope of eventually migrating this data locally to be shared in a more direct peer-to-peer fashion. Mesosphere will be aimed at iOS & Android, and released on Android via APK initially.

For more information, see [here.](https://github.com/SCCapstone/Mesosphere/wiki/Project-Description)

We will be programming in accordance with [JavaScript Standard Style](https://standardjs.com/index.html).

## Final Demo Video
PLACEHOLDER

## Features and Screenshots!

## External Requirements

In order to build this project you first have to install:

* [Node.js](https://nodejs.org/en/)  
* [React Native CLI](https://www.npmjs.com/package/react-native-cli)
* An android emulator. We recommend using the official [Android Studio Emulator.](https://developer.android.com/studio)

Once you are in the project's root directory run `npm install --global react-native-cli`.

## Setup

After cloning the repo and installing the above software, users should run `npm install --force` in the project's root directory, which will install all project dependencies listed in package.json.

## Running

To run the project, run `react-native run-android` in the terminal.  This will build and launch the app on an _already running_ emulated machine.

# Deployment (Outdated)

To build an APK for the Android platform, run `expo build:android -t apk`, or to build an Android App Bundle, `expo build:android -t app-bundle`. 
If building an Android App Bundle, ensure that Google Play App Signing is enabled for your project, more information can be found [here](https://developer.android.com/guide/app-bundle).

# Testing

The unit tests are in `/test/unit`.
The behavioral tests are in `/e2e/`.

## Testing Technology

Unit testing is done with the [Jest](https://jestjs.io) testing library.
Behavioral testing is done with the [Detox](https://github.com/wix/Detox) testing library.

## Running Unit Tests

Unit tests are run with `npm run test`.

## Running Behavioral Tests

These instructions are for a Windows machine, and uses Powershell.  A Google Doc with pictures can be found at https://docs.google.com/document/d/1zRyo-trcaG2ypgH6JTNMvaAxX5eEQsnjscOABk4gTFM/edit?usp=sharing

### Installing Android Studio Emulator & Tools.
For detox behavioral tests, an Android emulator must be utilized.  
Install the latest version of Android Studio (You will also need an android virtual device)  
  
Create a virtual android device  
Open the Virtual Device Manager (VDM)  
Select `Create Device` in the top left corner.  
Select `Pixel 2` 
For system image, tab over to `x86 Images` and scroll down to select `Pie 28 x86_64` (No Google API)  
  
You will need to download it first (click the blue download button).  
(In configuration Advanced Settings, you may want to increase the Internal Storage.  You can do this later).  
Now that you have an android emulator, it is recommended that you launch it once to enable quick-boot.  To do this, click `More` in the side menu (the three dots).  Navigate to `Snapshots` and switch `Auto Save current state to Quickboot` to No.  
  
This will ensure that before each behavioral test, the simulator is quick-booting from it's initial image.  
Lastly, ensure that your local kotlin version is up-to-date (1.6.10).  You can check this by navigating to Customize in Android Studio -> All Settings -> Languages and Frameworks -> Kotlin.  

If a new version is available, install it.  

### Restarting your machine
Installing a new Kotlin version requires a machine restart.  However, so do various other steps in these instructions.  For convenience, they have been compiled here to avoid unnecessary restarts.  
You will need Node Package Manager (https://nodejs.org/en/download/).  
You will also need Java 14  (16+ will not work): (https://www.oracle.com/java/technologies/javase/jdk14-archive-downloads.html).  
To build the dev apk, we will need gradle 6.8: https://gradle.org/next-steps/?version=6.8.3&format=all  
https://gradle.org/install/ (This may be optional, as react-native run-android also installs gradle)  
Edit your environment variables for your account.  Add the following (if they are not already present):  
ANDROID_SDK_ROOT	| `C:\Users\[User]\AppData\Local\Android\Sdk`  
JAVA_HOME			| `C:\Program Files\Java\jdk-14.0.2`  
PATH				| `C:\Program Files\Java\jdk-14.0.2\bin`  
| `C:\Users\[User]\AppData\Local\Android\Sdk\platform-tools`  
| `C:\Gradle\gradle-6.8.3\bin`  
  
You should replace [User] and jdk-14.0.2 with the relevant files on your machine.  You should also add these to your Path variable (Edit -> New).  After following the gradle instructions, you should also add `C:\Gradle\gradle-6.8.3\bin` to your Path variable.  
  
### Generating a debug apk
For the use of Detox behavioral testing, a debug apk must be generated.  Expo does not support this generation, so we'll have to do this locally.  Alternatively, an (out-of-date) debug apk can be found at [link](https://github.com/SCCapstone/Mesosphere/releases/tag/v0.2).  If you choose to install this, skip to the last section after completing this one. Clone the Mesosphere repository and cd into it.  
`git clone https://github.com/SCCapstone/Mesosphere.git`  
`cd .\Mesosphere\`  
`npm install --force`  
Now that the project is set up, an index needs to be generated to run the local apk.  You should also update the build tools and kotlin under android/build.gradle to match your most current build tools (visible in `C:\Users\[User]\AppData\Local\Android\Sdk\build-tools`)  
  
Since we're using react native, you should also install the cli tools  
`npm install -g react-native-cli`  
`npm install -g expo`  
`npm install -g expo-cli`  
`npm install -g detox-cli`  
  
The index is created through the following command (this will take a while):  
  
`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`  

Once that's done, run `react-native run-android` to test if you've been successful so far.  This will create and run an apk locally.  If it works, you're good to move on.  You may need to start your emulator manually before running the command.  
  
  
If you've gotten this far, you should be good to continue!  

### Building the APK.
Close your android emulator.  Detox will open its own.  Cd into the android library and run `./gradlew clean`  

CD back into the Mesosphere main folder (cd ../)  
Run `detox build -c android`  
If this also builds successfully, you should be ready to run your tests!  

### Running Detox Tests
Running the react-native commands may have installed the react-native build tools (29.0.2). This is fine.  However, you need to copy the file 'aapt' from it's current build tools location (32.0.0) to build-tools\metrics.  That would be:
`C:\Users\[User]\AppData\Local\Android\Sdk\build-tools\32.0.0\aapt`
Copied into
`C:\Users\[User]\AppData\Local\Android\Sdk\build-tools\metrics`

If you've installed a premade apk, place it at `Mesosphere/android/build/outputs/apk/debug/app-debug.apk` 
(or match the binaryPath variable in .detoxrc.json)

For now, we only have one test to run.  This section should update as more are added.  This test simply checks that the user lands on the login screen with all expected widgets.
Run `detox test -c android`

Done!


# Authors

Adam Gazdecki (gazdecki@email.sc.edu)  
Carleigh Gregory (cjg3@email.sc.edu)  
Cole Lewis (lewiscg@email.sc.edu)  
Divine Walker (divinew@email.sc.edu)  
Kevin Prince (ktprince@email.sc.edu)  

