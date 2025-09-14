module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',
                    path: '.env',
                },
            ],
            [
                'module-resolver',
                {
                    root: ['./src'],
                    alias: {
                        '@components': './src/components',
                        '@views': './src/views',
                        '@store': './src/store',
                        '@utils': './src/utils',
                        '@types': './src/types',
                        '@navigation': './src/navigation',
                        '@style': './src/style',
                        '@locales': './src/locales',
                    },
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};
