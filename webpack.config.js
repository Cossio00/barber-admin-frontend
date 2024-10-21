module.exports = {
    module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' },
            {test: /\.(js|jsx)$/, use: 'raw-loader' }],
    }
  };
  