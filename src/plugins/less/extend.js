module.exports = {
  install: function(less, pluginManager, functions) {
    functions.add('flexible', function({ value }) {
      return `${(value / 1440) * 100}vw`
    })
  }
}
