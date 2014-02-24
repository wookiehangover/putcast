var FilesCollection = require('./collection')
var FilesView = require('./collection_view')

module.exports = function (app) {
  return {

    files: new FilesCollection([], { token: app.token }),

    FilesView: FilesView,

    subDirectories: {},

    loadSubDirectory: function (id) {
      var sub = this.subDirectories[id]
      if (!sub) {
        this.subDirectories[id] = sub = new FilesCollection([], {
          id: id,
          token: app.token
        })
      }
      return sub
    },

    findFile: function (id) {
      id = parseInt(id, 10);
      var file = this.files.get(id);
      if (!file) {
        file = _.compact(_.invoke(this.subDirectories, 'get', id))[0]
      }
      return file;
    }

  }
}
