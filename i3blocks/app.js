#!/usr/bin/env node
const child_process = require("child_process")
const fs = require('fs')
const ipc = require('node-ipc');
const hue = require("node-hue-api")
const { lightState, HueApi } = hue
const { cie_to_rgb, rgb_to_cie } = require("./convert-color")

const LIGHT_ID = 1
const HUE_CONFIG_FILE = '/.hue'

ipc.config = {
    ...ipc.config,
    id: 'i3blocks-hue',
    stopRetrying: true,
    silent: true
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function findHueBridge() {
    hue.nupnpSearch()
    .then((res) => {
        if(res[0].ipaddress) {
            return res
        } else {
            return hue.upnpSearch(2000)
        }
    })
    .then((res) => {
        if(res[0].ipaddress) {
            console.log("<span foreground='#FFF'>Press Button on HUE Bridge</span>")
            fs.writeFileSync(process.env['HOME'] + HUE_CONFIG_FILE, res[0].ipaddress)
        } else {
            console.log("<span foreground='#FFF'>HUE Bridge Not Found</span>")
        }
    })
    .done();
}

function main(ipaddress, user) {
    var api = new HueApi(ipaddress, user)
    var state = lightState.create()

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
}

try {
    var hue_config = fs.readFileSync(process.env['HOME'] + HUE_CONFIG_FILE, {encoding: 'utf8'}).split('\n')
    if(hue_config.length == 1) {
        api_register = HueApi()
        api_register.registerUser(hue_config[0], 'i3blocks-hue')
        .then((user) => {
            fs.appendFileSync(process.env['HOME'] + HUE_CONFIG_FILE, '\n' + user, 'utf8')
            main(hue_config[0], user)
        })
        .fail(() => {
            console.log("<span foreground='#FFF'>Press Button on HUE Bridge</span>")
        })
        .done();
    } else if(hue_config.length >= 2) {
        main(hue_config[0], hue_config[1])
    } else {
        findHueBridge()
    }
} catch (e) {
    if(e.code == 'ENOENT') {
        findHueBridge()
    }
}