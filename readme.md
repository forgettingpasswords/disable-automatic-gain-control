# Disable automatic gain control

Greasemonkey script to inject a custom script tag which patches getUserMedia and deprecated variants
to disable automatic gain control for audio input.

Mostly ported from:
https://github.com/joeywatts/disable-autogain-control-extension

with minor subjective formatting changes

## Installation (Qutebrowser)
* Linux: copy `disable-auto-gain-control.js` to `~/.local/share/qutebrowser/greasemonkey/`
* MacOs: Don't know
* Windows: Don't know

## Food for thought
There are some additional audio traits which might be interesting to play with,
found on the browser version of slack

* echoCancellation: true
* googEchoCancellation: true
* googEchoCancellation2: true
* googHighpassFilter: true
* googNoiseSuppression: true
* googNoiseSuppression2: true
* noiseSuppression: true
