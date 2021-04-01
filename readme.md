## Audio Visualizer

_Warning_, this application features abrupt colour changes on the entire browser viewport. Please avoid watching if you are vulnerable to such visual effects.  
_Note_, this repository is not published with music. That said, you may use the "./audio/b64.py" script to encode audio files in Base64 and generate the required (and omitted) "./audio.js" file comprised of an object with 'track_title: track_data' pairs  



This is a relatively simple fft-based frequency analyser written in vanilla-js using the WebAudio APIs.  

The colours.js file features the names and hexes of common CSS colours, scraped from W3Schools.com (with json available [here](https://gist.github.com/kendfss/6a27250ee81df61115b1b6661818725a)).
That said, I wound up using HSL and RGB because it's easier to automate the pastel colours I'm quite fond of with those.  
The transport panel is fully operational. The progress indicator is a simple canvas element which updates with the song's current time, the icons come from [Wanderson Magalhaes' increasingly popular GUI Template](https://github.com/Wanderson-Magalhaes/Simple_PySide_Base).  


#### TODO
Rain, particle, and lindenmeyer systems.  
