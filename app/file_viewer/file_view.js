var $ = require('jquery')
var _ = require('lodash')
var Backbone = require('backbone')
var template = require('./templates/file.html')

var FileView = Backbone.View.extend({
  tagName: 'tr',

  template: template,

  initialize: function () {
    _.bindAll(this, 'checkConvertStatus')
    this.checkConvertStatus = _.debounce(this.checkConvertStatus, 500)
    this.listenTo(this.model, 'change:mp4', this.renderStatus)
  },

  events: {
    'click [data-action="convert"]': 'handleConvert',
    'mouseover': 'checkConvertStatus'
  },

  handleConvert: function () {
    this.lastChecked = Date.now() - 61e3;
    this.model.convert().then(this.checkConvertStatus);
  },

  checkConvertStatus: function () {
    if (!this.model.isVideo()) {
      return
    }

    if (this.lastChecked && (Date.now() - this.lastChecked) < 60e3 ) {
      return
    }

    this.$('a[data-action="convert"]')
      .text('Checking status...')
      .attr('disabled', true)

    var view = this;
    this.model.getStatus().always(function(){
      view.lastChecked = Date.now();
    })
  },

  renderStatus: function () {
    var mp4 = this.model.get('mp4')
    var status = mp4 && mp4.status

    if (!status) {
      return
    }

    var $btn = this.$('a[data-action="convert"]')
    var classes = ['btn-warning', 'btn-info', 'btn-success', 'btn-danger' ]

    switch(status) {
      case 'IN_QUEUE':
        $btn
          .text('In Queue')
          .removeClass(classes)
          .addClass('btn-warning')
          break;
      case 'COMPLETED':
        this.$('.title').addClass('success')
        $btn
          .text('Completed')
          .removeClass(classes)
          .addClass('btn-success')
        break;
      case 'CONVERTING':
        $btn
          .text('Converting: ' + mp4.percent_done)
          .removeClass(classes)
          .addClass('btn-danger')
        break;
      case 'NOT_AVAILABLE':
        $btn
          .text('Convert to Mp4')
          .attr('disabled', false)
          break;
      default:
        break;
    }
  },

  render: function () {
    this.$el.html(this.template())
    return this.el
  },

  presentUrl: function () {
    if (this.model.isDirectory()) {
      return '#/parent/' + this.model.get('id')
    } else {
      return '#/stream/' + this.model.get('id')
    }
  }
})

module.exports = FileView
