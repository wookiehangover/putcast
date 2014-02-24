var $ = require('jquery')
var Backbone = require('backbone')
var videoTemplate = require('./video_template.html')
var CastPlayer = require('./cast_player')
require('./affix')

module.exports = Backbone.View.extend({

  initialize: function (options) {
    if (!options.app) {
      throw new Error('FilesView requires an app instance')
    }
    this.app = options.app
    this.render()
    this.video = new CastPlayer()
  },

  render: function () {
    this.$el.html(videoTemplate())
    this.$('[data-spy="affix"]').affix({
      offset: {
        top: 10,
        bottom: 5
      }
    })
  }
})
