# i3blocks-hue-status
i3blocks blocklet that shows status of a hue light, and has basic controls

I have just got this working as a proof of concept. To get it working on any other system ATM will need quite a bit of reconfiguring.

I aim to update it to be more generally usable.

### Requirements
* Node
* node-hue-api
* yad
* font-awesome

### Sample config
```
[light]
command=/home/rowan/Documents/GitHub/Light-Control/app.js
interval=10
markup=pango
```

### Controls
```
On - Left Click
Off - Right Click
Brighter - Scroll Up
Dimmer - Scroll Down
Select Colour - Middle Click
```

### Thinks to note with this version
1. It does not currently detect try to connect to your hue bridge
    * Instructions to set this up are [here](https://github.com/peter-murray/node-hue-api#examples)
    * You'll need to update the bridge's IP on line 33 of app.js
    * You'll need to update line 34 of app.js with your own username
2. The colour picker is not good
    * I will try and make it better when I learn how to and have time
3. The colour conversion does not work perfectly at all
    * Again I will try and make this better when I learn how