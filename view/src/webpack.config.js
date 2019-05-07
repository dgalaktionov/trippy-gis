let path = require("path");
let VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "."),
        filename: "../bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "ignore-loader"
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
