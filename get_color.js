#!/usr/bin/env node
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;
var fs = require('fs')

const LIGHT_ID = 1

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayBrightness = function(status) {
	var brightness = parseInt(100*status.state.bri/254)
	if(status.state.on) {
		console.log(brightness + '%')
	} else {
		console.log('0%')
	}
	// console.log(status.state.bri)
}

var host = "192.168.0.51",
    username = "q9DF5gSoJPgq-E4Z05gzXMduLVD1RzU9kY47eBkM",
    api = new HueApi(host, username),
    state = lightState.create();


// // --------------------------
// // Using a promise


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var x,y,z,X,Y,Z,r,g,b
api.lightStatusWithRGB(LIGHT_ID)
	.then((res) => {
		console.log(rgbToHex(res.state.rgb[0],res.state.rgb[1],res.state.rgb[2]))
	})
	.done()