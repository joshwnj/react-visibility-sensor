// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    preprocessors: {
      '**/*.jsx': ['jsx']
    },
    browsers: ['Chrome']
  });
};
