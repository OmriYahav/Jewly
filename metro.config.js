const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const overrides = {
  'react-native-worklets/lib/module/utils/jsVersion': path.resolve(
    __dirname,
    'patches/react-native-worklets/jsVersion.js'
  ),
  'react-native-worklets/src/utils/jsVersion': path.resolve(
    __dirname,
    'patches/react-native-worklets/jsVersion.js'
  ),
};

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  ...overrides,
};

module.exports = config;
