var $ = require('jquery')
var Backbone = require('backbone')
var API_ROOT = 'https://api.put.io/v2'

module.exports = Backbone.Model.extend({

  convert: function () {
    var params = {
      method: 'post',
      dataType: 'json',
      url: [
        API_ROOT,
        '/files/',
        this.get('id'),
        '/mp4?oauth_token=',
        this.collection.token
      ].join('')
    }
    return $.ajax(params)
  },

  getStatus: function () {
    var params = {
      method: 'get',
      dataType: 'json',
      url: [
        API_ROOT,
        '/files/',
        this.get('id'),
        '/mp4?oauth_token=',
        this.collection.token,
        '&callback=?'
      ].join('')
    }
    var model = this
    return $.ajax(params).then(function(data){
      if (data.mp4) {
        model.set('mp4', data.mp4)
      }
    })
  },

  isDirectory: function () {
    return (/directory/).test(this.get('content_type'))
  },

  isVideo: function () {
    return (/video/).test(this.get('content_type'))
  },

  isMp4: function(){
    if (this.get('mp4')) {
      return this.get('mp4').status === 'COMPLETED';
    }
    return this.get('is_mp4_available') || (/mp4/).test(this.get('content_type'))
  },

  streamingUrl: function () {
    var url = [
      'https://put.io/v2/files/',
      this.get('id'),
      this.isMp4() ? '/mp4/stream' : '/stream',
      '?token=1d39fbc91cbb0d4afade783ca3a36817b5c1ca2a'
    ]
    return url.join('')
  }
})
