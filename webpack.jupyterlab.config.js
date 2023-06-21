module.exports = {
  module: {
    rules: [
      {
        test: /\.image.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.tsx$/,
        use: [
          '@svgr/webpack'
        ],
      },
    ]
  },
};
