// // metro.config.js
// const {
//     wrapWithReanimatedMetroConfig,
// } = require('react-native-reanimated/metro-config');
//
// const config = {
//     // Your existing Metro configuration options
// };
//
// module.exports = wrapWithReanimatedMetroConfig(config);

// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;

// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
//
// /**
//  * Metro configuration
//  * https://metrobundler.dev/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};
//
// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
