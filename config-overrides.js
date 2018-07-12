const { injectBabelPlugin } = require('react-app-rewired')
const rewireStyledComponents = require('react-app-rewire-styled-components')

module.exports = function override(config, env) {
  config = injectBabelPlugin('transform-decorators-legacy', config)
  config = rewireStyledComponents(config, env)
  
  return config
}