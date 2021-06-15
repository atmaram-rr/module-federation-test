const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const deps = require("./package.json").dependencies;

const appDirectory = process.cwd();

const typescriptConfig = {
    "compilerOptions": {
        allowSyntheticDefaultImports: true,
        "baseUrl": appDirectory,
        "outDir": path.join(appDirectory, 'assets'),
        "noImplicitAny": true,
        "module": "es6",
        "target": "es5",
        "jsx": "react",
        "allowJs": true,
        "moduleResolution": "node",
        "noEmit": false,
    },
    "include": [
        path.join(appDirectory, "src/**/*")
    ],
    "exclude": [
        path.join(appDirectory, "node_modules"),
        // path.join(appDirectory, "**/*.d.ts"),
    ],
};

require('fs').writeFileSync(path.join(appDirectory, 'assets/tsconfig.json'), JSON.stringify(typescriptConfig));

module.exports = {
    mode: 'development',
    entry: {
        // TODO: Change to handle both js and ts files
        rrCustom: path.join(appDirectory, 'src/index.js'),
    },
    performance: {
        maxEntrypointSize: 4096000,
        maxAssetSize: 4096000,
    },
    output: {
        path: path.join(appDirectory, 'build'),
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    {
                        loader: require.resolve('style-loader'),
                    },
                    {
                        loader: require.resolve('css-loader'),
                    },
                    {
                        loader: require.resolve('sass-loader'),
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'asset',
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.join(appDirectory, 'assets/tsconfig.json'),
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ],
    },
    devServer: {
        contentBase: path.resolve(appDirectory, 'build'),
        watchContentBase: true,
        historyApiFallback: true,
        port: 3000,
        hot: true,
        open: true,
        progress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(appDirectory, 'src/index.html'),
            templateParameters: {
                PUBLIC_URL: '',
            },
        }),
        new Webpack.container.ModuleFederationPlugin({
            name: 'rrCustom',
            filename: 'remoteEntry.js',
            exposes: {
                'leftbarEntries': path.join(appDirectory, 'src/leftbarEntries.tsx'),
                'routeComponents': path.join(appDirectory, 'src/routeComponents.tsx'),
            },
            // shared: ['react', 'react-dom', '@reach/router'],
            shared: [
                {
                    'react': {
                        singleton: true,
                        // requiredVersion: deps.react,
                    },
                    'react-dom': {
                        singleton: true,
                        // requiredVersion: deps['react-dom']
                    },
                    '@reach/router': {
                        singleton: true,
                    },
                    antd: {
                        singleton: true,
                    },
                },

            ],
        }),
    ],
};