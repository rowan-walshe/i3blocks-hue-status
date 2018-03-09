#!/usr/bin/env node
var child_process = require("child_process")

child_process.exec('yad --color --posx=2751 --posy=1159', (err, stdout, stderr) => {
                
    color = parseInt(stdout.split('\n')[0].substring(1),16)

    r = color >> 16
    g = (color >> 8) & 255
    b = color & 255

    console.log(r)
    console.log(g)
    console.log(b)

    // state = lightState.create().on().rgb(r,g,b)

    // api.setLightState(LIGHT_ID, state)
    // .then(() => {return api.lightStatusWithRGB(LIGHT_ID)})
    // .then(displayBrightness)
    // .done()
})