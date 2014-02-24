var $ = require('jquery')
var _ = require('lodash')
var Backbone = require('backbone')
var FileView = require('./file_view')
var Collection = require('./collection')
var errorTemplate = require('./templates/error.html')
var listTemplate = require('./templates/list.html')

var FilesView = Backbone.View.extend({

  errorTemplate: errorTemplate,

  tagName: 'section',

  className: 'file-list',

  initialize: function (options) {
    if (!this.collection) {
      throw new Error('FilesView requires a collection')
    }
    if (!options.app) {
      throw new Error('FilesView requires an app instance')
    }
    this.app = options.app
    _.bindAll(this, 'renderError', 'renderFileList')
    this.render()
    this.preloadSubDirectoryCollection = _.debounce(
      this.preloadSubDirectoryCollection, 250
    )
  },

  events: {
    'mouseover tr': 'preloadSubDirectoryCollection'
  },

  preloadSubDirectoryCollection: function (e) {
    var parentId = $(e.currentTarget).find('a[data-parent]').data('parent')
    if (!parentId) {
      return
    }
    this.app.loadSubDirectory(parentId);
  },

  renderFile: function (model) {
    if (!model.view) {
      model.view = new FileView({ model: model })
    }
    return model.view.render()
  },

  render: function () {
    this.collection.onLoaded.then(this.renderFileList, this.renderError)
  },

  renderFileList: function () {
    var $list = $(listTemplate())
    $list.find('tbody').html(this.collection.map(this.renderFile, this))
    this.$el.html($list)
  },

  renderError: function () {
    this.$el.html(this.errorTemplate());
  }
})

FilesView.Collection = Collection;

module.exports = FilesView;
