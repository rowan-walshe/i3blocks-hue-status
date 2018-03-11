const ipc = require('node-ipc');

ipc.config = {
    ...ipc.config,
    id: 'i3blocks-hue',
    stopRetrying: true,
    silent: true
}

ipc.connectTo('i3blocks-hue-app', () => {
  ipc.of['i3blocks-hue-app'].on('connect', () => {
    ipc.of['i3blocks-hue-app'].emit('show-color-picker', "")
    ipc.disconnect('i3blocks-hue-app')
  })
})