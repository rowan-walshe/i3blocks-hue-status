# i3blocks-hue-status
i3blocks blocklet that shows status of a hue light, and has basic controls

I have just got this working as a proof of concept. To get it working on any other system ATM will need quite a bit of reconfiguring.

I aim to update it to be more generally usable.

<p align="center">
  <img src="https://user-images.githubusercontent.com/9976046/37248423-1c14d24c-24ca-11e8-99da-65d74f93d324.png" alt="Pic of Color Picker"/>
</p>

### Requirements
* Node
* Node dependencies
* font-awesome

### Sample i3blocks.conf
```
[light]
command=/home/rowan/Documents/GitHub/Light-Control/app.js
interval=1
markup=pango
```

### Add to i3 config
```
for_window [class="electron-hue-color-picker"] floating enable
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
2. It does not dynamically detect the size of the screen, and so on most screens you will probably find it appearing in the middle
	* You can change the position it appear at on line 39 and 49 of main.js (the elctron app)
3. The colour picker is better than it was, but still not perfect
    * I will try and make it better when I learn how to and have time
