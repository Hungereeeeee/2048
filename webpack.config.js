var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
module.exports = {
    entry: './js/main.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015'
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
        ]
    },
    plugins: [
    new uglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
    ]
}
