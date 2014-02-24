var Backbone = require('backbone')

module.exports = Backbone.Router.extend({
  initialize: function (options) {
    if (!options.app) {
      throw new Error('App instance is required')
    }
    this.app = options.app
  },

  routes: {
    'logout': 'logout',
    'stream/:id': 'stream',
    'parent/:id': 'browse',
    '': 'browse'
  },

  logout: function () {
    localStorage.removeItem('token')
    location.reload()
  },

  stream: function (id) {
    var model = this.app.findFile(id)
    if (model) {
      this.app.player.video.selectMedia(model)
    }
  },

  browse: function (parent) {
    var name, collection
    if (parent) {
      name = 'show'+parent
      collection = this.app.loadSubDirectory(parent)
    } else {
      name = 'index'
      collection = this.app.files
    }
    this.app.loadView(name, 'FilesView', {
      app: this.app,
      collection: collection
    })
  }
})
