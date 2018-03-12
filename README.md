# i3blocks-hue-status
i3blocks blocklet that shows status of a hue light, and has basic controls

I have just got this working as a proof of concept, and has a very limited feature set.

<p align="center">
  <img src="https://user-images.githubusercontent.com/9976046/37248460-bcbc0472-24ca-11e8-9885-183edd1a986a.png" alt="Pic of Color Picker"/>
</p>

### Latest Release
[Download from here](https://github.com/Rauwomos/i3blocks-hue-status/releases/latest)

### Requirements
* font-awesome

### Sample i3blocks.conf
```
[light]
command=/home/rowan/.config/i3/Light-Control/app
interval=1
markup=pango
```

### Add to i3 config
```
for_window [class="electron-hue-color-picker"] floating enable
```

### Controls
```
Left Click - On
Right Click - Off
Scroll Up - Increase brightness
Scroll Down - Decrease brightness
Middle Click - Select Colour
```

### Setup Instructions
1. Unzip the release to ~/.config/i3/
	* You should then have the following
		* ~/.config/i3/Light-Control/app
		* ~/.config/i3/Light-Control/electron-hue-color-picker-linux-x64
	* You can put the app executable wherever you want, just update your i3blocks config
	* If you change the location of the electron-hue-color-picker, add the new location as an argument in your i3blocks.conf. E.g.
		* `command=/home/rowan/.config/i3/Light-Control/app ~/.config/i3/electron-hue-color-picker`
2. Add the require lines to i3blocks.conf and your i3 config

### Thinks to note with this version
1. I'm unsure how this will work with multi-monitor setups and am unable to test it
2. The colour picker is better than it was, but still not perfect
    * I will try and make it better when I learn how to and have time

