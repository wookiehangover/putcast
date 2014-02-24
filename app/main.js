var $ = require('jquery')
var _ = require('lodash')
var Backbone = require('backbone')

var Router = require('./router')
var fileViewer = require('./file_viewer/main')
var castPlayer = require('./cast_player/main')
var Auth = require('./auth/main')

var ApplicationView = Backbone.View.extend({
  el: $('body'),

  initialize: function () {
    this.auth = new Auth()

    this.listenTo(this.auth, 'token', function (token) {
      this.token = token
      this.views = {}
      _.extend(this, fileViewer(this))
      this.player = castPlayer.create({ app: this, el: this.$('#player') })
      this.router = new Router({ app: this })
      Backbone.history.start()
    }, this)
  },

  render: function (view) {
    if (!view) {
      return
    }

    this.$('#main section.ui-active').removeClass('ui-active')
    if (!$.contains(this.$('#main')[0], view.el)) {
      this.$('#main').append(view.el)
    }
    view.$el.addClass('ui-active')
  },

  loadView: function (name, constr, parent) {
    var view = this.views[name]
    if (!view) {
      view = this.views[name] = this.createView(constr, parent)
    }
    this.render(view)
  },

  createView: function (constr, options) {
    if (!this[constr]) {
      throw new Error('No view registered with that name')
    }
    return new this[constr](options)
  }

});

$(function () {
  window.app = new ApplicationView();
});
