module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      // Expo Router integration
      require.resolve('expo-router/babel'),
      // Reanimated must come LAST
      'react-native-reanimated/plugin',
    ],
  };
};
