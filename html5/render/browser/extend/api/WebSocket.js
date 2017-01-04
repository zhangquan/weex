/* global WebSocket */
'use strict'

let instance
let callback = { }

const WebSocketIns = {

  WebSocket: function (url, protocol) {
    if (instance) {
      instance.close()
      instance = undefined
      callback = { }
    }
    const self = this
    instance = new WebSocket(url, protocol)
    instance.onopen = function (e) {
      setTimeout(function () {
        if (callback.onopen) {
          self.sender.performCallback(callback.onopen, { type: e.type }, true)
        }
      }, 10)
    }

    instance.onmessage = function (e) {
      setTimeout(function () {
        if (callback.onmessage) {
          self.sender.performCallback(callback.onmessage, { origin: e.origin, data: e.data, source: e.data }, true)
        }
      }, 10)
    }

    instance.onerror = function (e) {
      setTimeout(function () {
        if (callback.onerror) {
          self.sender.performCallback(callback.onerror, { code: e.code, data: e.data })
        }
      }, 10)
    }

    instance.onclose = function (e) {
      setTimeout(function () {
        if (callback.onclose) {
          self.sender.performCallback(callback.onclose, { data: e.data, code: e.code, reason: e.reason })
        }
      }, 10)
    }
  },

  close: function (code, signal) {
    if (instance) {
      instance.close(code, signal)
      instance = undefined
      callback = { }
    }
  },

  send: function (data) {
    if (instance) {
      instance.send(data)
    }
  },

  onopen: function (func) {
    if (instance) {
      callback.onopen = func
    }
  },

  onerror: function (func) {
    if (instance) {
      callback.onerror = func
    }
  },

  onmessage: function (func) {
    if (instance) {
      callback.onmessage = func
    }
  },

  onclose: function (func) {
    if (instance) {
      callback.onclose = func
    }
  }
}

const meta = {
  WebSocket: [{
    name: 'WebSocket',
    args: ['string', 'string']
  }, {
    name: 'close',
    args: ['numble', 'string']
  }, {
    name: 'send',
    args: ['string']
  }, {
    name: 'onopen',
    args: ['function']
  }, {
    name: 'onmessage',
    args: ['function']
  }, {
    name: 'onclose',
    args: ['function']
  }, {
    name: 'onerror',
    args: ['function']
  }]
}

export default {
  init: function (Weex) {
    Weex.registerApiModule('WebSocket', WebSocketIns, meta)
  }
}
