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

### Thinks to note with this version
1. Unzip the release to ~/.config/i3/
	* You should then have the following
		* ~/.config/i3/Light-Control/app
		* ~/.config/i3/Light-Control/electron-hue-color-picker-linux-x64
	* If you want to change these directories, then you will have to download the source code, install the node dependencies and change HUE_APP_LOCATION
	* I will try and find a nicer way to allow you to change this in the future
2. I'm unsure how this will work with multi-monitor setups and am unable to test it
3. The colour picker is better than it was, but still not perfect
    * I will try and make it better when I learn how to and have time

