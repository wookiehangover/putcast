var $ = require('jquery')
var Backbone = require('backbone')
var deparam = require('node-jquery-deparam')
var modalTemplate = require('./token_modal.html')
require('./modal')

var TokenView = Backbone.View.extend({

  template: modalTemplate,

  initialize: function () {
    var cachedToken = localStorage.getItem('token')
    var hash = location.hash.replace('#','')
    hash = deparam(hash)

    if (cachedToken) {
      _.defer(_.bind(function(){
        this.trigger('token', cachedToken)
      }, this))

    } else if (hash.access_token) {
      localStorage.setItem('token', hash.access_token)
      location.hash = '#/'
      _.defer(_.bind(function(){
        this.trigger('token', hash.access_token)
      }, this))

    } else {
      this.render()
    }
  },

  login: function(){
    var qs = {
      client_id: 1133,
      response_type: 'token',
      redirect_uri: 'http://localhost:3000/'
    }
    location = 'https://api.put.io/v2/oauth2/authenticate?' + $.param(qs)
  },

  render: function () {
    this.$el.html(this.template()).appendTo('body')
    this.$('#auth').modal()
  },

  events: {
    'click [data-action="login"]': 'login',
    'click [data-action="save"]': 'saveApiToken',
    'submit form': 'saveApiToken'
  },

  saveApiToken: function (e) {
    e.preventDefault()
    var input = this.$('#token').val()

    if (!input) {
      return this.$('form').submit()
    }

    localStorage.setItem('token', input);
    this.trigger('token', input);
    this.$('#auth').modal('hide')
  },

})

module.exports = TokenView


