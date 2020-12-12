const { unescapeLeadingUnderscores } = require("typescript")

module.exports = function(config) {
  require('./karma.conf')(config)

  config.set({
    browsers: ['Chrome'],
    singleRun: false,
    autoWatch: true,
    restartOnFileChange: true
  });
}
