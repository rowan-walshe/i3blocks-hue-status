#!/usr/bin/env node
const child_process = require("child_process")
const fs = require('fs')
const ipc = require('node-ipc');

const { lightState, HueApi } = require("node-hue-api")
const { cie_to_rgb, rgb_to_cie } = require("./convert-color")

const LIGHT_ID = 1

ipc.config = {
    ...ipc.config,
    id: 'i3blocks-hue',
    stopRetrying: true,
    silent: true
}

var host = "192.168.0.51",
    username = "q9DF5gSoJPgq-E4Z05gzXMduLVD1RzU9kY47eBkM",
    api = new HueApi(host, username),
    state = lightState.create();

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var displayBrightness = function(status) {
    var brightness = parseInt(100*status.state.bri/254)
    if(status.state.on) {
        console.log("<span foreground='" + rgbToHex(status.state.rgb[0],status.state.rgb[1],status.state.rgb[2]) + "'> " + brightness + "%</span>")
    } else {
        console.log("<span foreground='" + rgbToHex(status.state.rgb[0],status.state.rgb[1],status.state.rgb[2]) + "'> 0%</span>")
    }
}

switch(process.env.BLOCK_BUTTON) {
    case '1':
        api.setLightState(LIGHT_ID, state.on())
        .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
        .then(displayBrightness)
        .done()
        break;
    case '2':
        ipc.connectTo('i3blocks-hue-app', () => {
          ipc.of['i3blocks-hue-app'].on('connect', () => {
            ipc.of['i3blocks-hue-app'].emit('show-color-picker', "show")
            ipc.disconnect('i3blocks-hue-app')
          })
        })
        api.lightStatusWithRGB(LIGHT_ID)
        .then(displayBrightness)
        .done()
        break;
    case '3':
        api.setLightState(LIGHT_ID, state.off())
        .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
        .then(displayBrightness)
        .done()
        break;
    case '4':
        api.setLightState(LIGHT_ID, state.bri_inc(25))
        .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
        .then(displayBrightness)
        .done()
        break
    case '5':
        api.setLightState(LIGHT_ID, state.bri_inc(-25))
        .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
        .then(displayBrightness)
        .done()
        break
    default:
    api.lightStatusWithRGB(LIGHT_ID)
    .then(displayBrightness)
    .done()
}