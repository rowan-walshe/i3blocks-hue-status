const { app, BrowserWindow, ipcMain } = require('electron')

const path = require('path')
const url = require('url')
const ipc = require('node-ipc')
const fs = require('fs')

let mainWindow

var config = fs.readFileSync(process.env['HOME'] + '/.hue', {encoding: 'UTF-8'}).split('\n')

global.sharedObject = {config}

// Spread operator through error?
// ipc.config = {
//     ...ipc.config,
//     id: 'i3blocks-hue',
//     stopRetrying: true,
//     silent: true
// }

// As spread operator is not working
ipc.config.id = 'i3blocks-hue-app'
ipc.config.stopRetrying = true
ipc.config.silent = true

function createWindow () {

  mainWindow = new BrowserWindow({width: 320, height: 320, frame: false, show: false})
  // mainWindow = new BrowserWindow({width: 1000, height: 1000, frame: false, show: false})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Comment out to not show on startup
  // mainWindow.on('ready-to-show', mainWindow.show)
  
  mainWindow.on('show', () => {
    mainWindow.setPosition(3120,1100)
  })

  mainWindow.on('close', function(e){
    if(mainWindow.forceClose) return
    e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('move', (e) => {
    mainWindow.setPosition(3120,1100)
  })

}

// Create a window whent he app is ready
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', app.quit)

app.on('activate-with-no-open-windows', function(){
      mainWindow.show()
})

app.on('before-quit', () => {
    mainWindow.removeAllListeners('close')
    mainWindow.close()
})

// Hide the mainWindow when a colour is selected
ipcMain.on('hide', (event, arg) => {
  if(arg == 'hide' && mainWindow) {
    mainWindow.hide()
  }
  ipc.server.broadcast('show-color-picker', 'update')
  event.returnValue = 'test'
})

ipc.serve(() => ipc.server.on('show-color-picker', message => {
  if(mainWindow) {
    mainWindow.show()
  }
}))

ipc.server.start()