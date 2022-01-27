// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

module.exports = (() => {
	return {
		resolver: {
			sourceExts: ['cjs', 'js', 'ts', 'jsx', 'tsx'], // Adding here all needed extensions in your app
		},
	}
})()