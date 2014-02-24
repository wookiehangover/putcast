var Backbone = require('backbone')
var Model = require('./file_model')

var FilesCollection = Backbone.Collection.extend({
  url: function () {
    return 'https://api.put.io/v2/files/list?oauth_token=' + this.token + '&callback=?';
  },

  model: Model,

  initialize: function (models, options) {
    if (!options.token) {
      throw new Error('API token  required')
    }
    this.token = options.token

    if (options.id) {
      this.token = this.token + '&parent_id=' + options.id
    }
    this.onLoaded = this.fetch()
  },

  parse: function (data) {
    if (data && data.files) {
      return data.files
    } else {
      return data
    }
  }
});


module.exports = FilesCollection;


