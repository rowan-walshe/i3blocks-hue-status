#!/usr/bin/env node
var child_process = require("child_process")
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;
var fs = require('fs')

const LIGHT_ID = 1

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayBrightness = function(status) {
    var brightness = parseInt(100*status.state.bri/254)
    if(status.state.on) {
        console.log("<span foreground='" + rgbToHex(status.state.rgb[0],status.state.rgb[1],status.state.rgb[2]) + "'> " + brightness + "%</span>")
    } else {
        console.log("<span foreground='" + rgbToHex(status.state.rgb[0],status.state.rgb[1],status.state.rgb[2]) + "'> 0%</span>")
    }
    // console.log(status.state.bri)
}

var host = "192.168.0.51",
    username = "q9DF5gSoJPgq-E4Z05gzXMduLVD1RzU9kY47eBkM",
    api = new HueApi(host, username),
    state = lightState.create();


// // --------------------------
// // Using a promise

switch(process.env.BLOCK_BUTTON) {
    case '1':
        api.setLightState(LIGHT_ID, state.on())
        .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
        .then(displayBrightness)
        .done()
        break;
    case '2':
        api.lightStatusWithRGB(LIGHT_ID)
        .then((res) => {
            hex = rgbToHex(res.state.rgb[0], res.state.rgb[1], res.state.rgb[2])
            return child_process.exec('yad --color --posx=2753 --posy=1161 --close-on-unfocus --init-color=' + hex, (err, stdout, stderr) => {
                
                color = parseInt(stdout.split('\n')[0].substring(1),16)
                if(!isNaN(color)) {
                    r = color >> 16
                    g = (color >> 8) & 255
                    b = color & 255

                    state = lightState.create().on().rgb(r,g,b)
                }

                api.setLightState(LIGHT_ID, state)
                .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
                .then(displayBrightness)
                .done()
            })
        })
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
// api.setLightState(1, state.brightness(100))
//     .then(displayResult)
//     .done();

// api.lightStatus(LIGHT_ID)
//  .then(displayBrightness)
//  .done()

// fs.appendFileSync('/home/rowan/Documents/GitHub/Light-Control/out.log', typeof process.env.BLOCK_BUTTON + '\n')