const path = require('path');

module.exports = {
  entry: './dev/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js')
  },
  mode: 'production'
};