const path = require('path');

module.exports = {
    entry: './src/main/resources/static/scripts/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public/dist/scripts')
    }
};