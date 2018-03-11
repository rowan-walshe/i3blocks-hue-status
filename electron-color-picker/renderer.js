const $ = require('jquery')
var fs = require('fs')
const path = require('path')
var {remote, ipcRenderer} = require('electron')
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

const LIGHT_ID = 1
const NS_PER_SEC = 1e9

const argv = remote.getGlobal('sharedObject').argv

var host = argv[2],
    username = argv[3],
    api = new HueApi(host, username),
    state = lightState.create()

$(() => {

    // create canvas and context objects
    var canvas = document.getElementById('picker')
    var ctx = canvas.getContext('2d')

    var last_api_call = process.hrtime()

    // drawing active image
    var image = new Image()
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height) // draw the image on the canvas
    }

    image.src = path.join(__dirname, 'images/colorwheel.png')

    $('#picker').mousemove(function(e) { // mouse move handler
        // get coordinates of current position
        var canvasOffset = $(canvas).offset()
        var canvasX = Math.floor(e.pageX - canvasOffset.left)
        var canvasY = Math.floor(e.pageY - canvasOffset.top)

        // get current pixel
        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1)
        var pixel = imageData.data

        // update controls
        $('#rVal').val(pixel[0])
        $('#gVal').val(pixel[1])
        $('#bVal').val(pixel[2])
        $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2])

        var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0]
        var hex = dColor.toString(16)
        $('#hexVal').val('#' + hex)

        let diff = process.hrtime(last_api_call)

        if(diff[0] > 0 || diff[1] > 1e8) {
            last_api_call = process.hrtime()

            let xy = rgb_to_cie(pixel[0],pixel[1],pixel[2])

            let state = lightState.create().on().xy(xy[0], xy[1])

            api.setLightState(LIGHT_ID, state)
                .done()
        }

    })

    $('#picker').click(function(e) { // click event handler
        ipcRenderer.sendSync('hide', 'hide')
    }) 
})

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

// ----------------------------------------------------------------

/*
The MIT License (MIT)
Copyright (c) 2017 www.usolved.net
Published under https://github.com/usolved/cie-rgb-converter
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


// ----------------------------------------------------------------

/**
 * Converts CIE color space to RGB color space
 * @param {Number} x
 * @param {Number} y
 * @param {Number} brightness - Ranges from 1 to 254
 * @return {Array} Array that contains the color values for red, green and blue
 */
function cie_to_rgb(x, y, brightness)
{
    //Set to maximum brightness if no custom value was given (Not the slick ECMAScript 6 way for compatibility reasons)
    if (brightness === undefined) {
        brightness = 254
    }

    var z = 1.0 - x - y
    var Y = (brightness / 254).toFixed(2)
    var X = (Y / y) * x
    var Z = (Y / y) * z

    //Convert to RGB using Wide RGB D65 conversion
    var red     =  X * 1.656492 - Y * 0.354851 - Z * 0.255038
    var green   = -X * 0.707196 + Y * 1.655397 + Z * 0.036152
    var blue    =  X * 0.051713 - Y * 0.121364 + Z * 1.011530

    //If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
    if (red > blue && red > green && red > 1.0) {

        green = green / red
        blue = blue / red
        red = 1.0
    }
    else if (green > blue && green > red && green > 1.0) {

        red = red / green
        blue = blue / green
        green = 1.0
    }
    else if (blue > red && blue > green && blue > 1.0) {

        red = red / blue
        green = green / blue
        blue = 1.0
    }

    //Reverse gamma correction
    red     = red <= 0.0031308 ? 12.92 * red : (1.0 + 0.055) * Math.pow(red, (1.0 / 2.4)) - 0.055
    green   = green <= 0.0031308 ? 12.92 * green : (1.0 + 0.055) * Math.pow(green, (1.0 / 2.4)) - 0.055
    blue    = blue <= 0.0031308 ? 12.92 * blue : (1.0 + 0.055) * Math.pow(blue, (1.0 / 2.4)) - 0.055


    //Convert normalized decimal to decimal
    red     = Math.round(red * 255)
    green   = Math.round(green * 255)
    blue    = Math.round(blue * 255)

    if (isNaN(red))
        red = 0

    if (isNaN(green))
        green = 0

    if (isNaN(blue))
        blue = 0


    return [red, green, blue]
}


/**
 * Converts RGB color space to CIE color space
 * @param {Number} red
 * @param {Number} green
 * @param {Number} blue
 * @return {Array} Array that contains the CIE color values for x and y
 */
function rgb_to_cie(red, green, blue)
{
    //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
    var red     = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92)
    var green   = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92)
    var blue    = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92) 

    //RGB values to XYZ using the Wide RGB D65 conversion formula
    var X       = red * 0.664511 + green * 0.154324 + blue * 0.162028
    var Y       = red * 0.283881 + green * 0.668433 + blue * 0.047685
    var Z       = red * 0.000088 + green * 0.072310 + blue * 0.986039

    //Calculate the xy values from the XYZ values
    var x       = (X / (X + Y + Z)).toFixed(4)
    var y       = (Y / (X + Y + Z)).toFixed(4)

    if (isNaN(x))
        x = 0

    if (isNaN(y))
        y = 0   


    return [x, y]
}