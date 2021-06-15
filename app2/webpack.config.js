const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const appDirectory = process.cwd();

module.exports = {
    mode: 'development',
    entry: {
        // TODO: Change to handle both js and ts files
        rrCustom: path.join(appDirectory, 'src/index.js'),
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
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                        },
                    },
                ],
            },
            {
                test: /\.m?js/, // For webpack upgrade fix.
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
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
        ],
    },
    devServer: {
        contentBase: path.resolve(appDirectory, 'build'),
        watchContentBase: true,
        historyApiFallback: true,
        port: 4000,
        hot: true,
        open: true,
        progress: true,
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(appDirectory, 'src/index.html'),
            templateParameters: {
                PUBLIC_URL: '',
            },
        }),

        new ForkTsCheckerWebpackPlugin({
            async: true,
            logger: {
                devServer: false,
            },
        }),
        new Webpack.container.ModuleFederationPlugin({
            name: 'amrUI',
            remotes: {
                rrCustom: 'rrCustom@http://localhost:2000/remoteEntry.js'
            },
            // shared: ['react', 'react-dom', '@reach/router'],
            shared: [
                {
                    react: {
                        singleton: true,
                    },
                    'react-dom': {
                        singleton: true,
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