const sketchpad = document.getElementById('sketchpad');
sketchpad.width = window.innerWidth;
sketchpad.height = window.innerHeight;
const trackNameBox = document.getElementById('trackNameBox');
const pageTitle = document.getElementById('pageTitle');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const rewindButton = document.getElementById('rewindButton');
const fowindButton = document.getElementById('fowindButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const progressBar = document.getElementById('progressBar');

var framerate = 30; 
// var dtFrame = (1000/60) * (60 / framerate) - (1000/60) * 0.5; 
var dtFrame = framerate ** -1; 
var lastFrame = 0; 

const ctx = sketchpad.getContext('2d');
const trackCount = len(audios);
const icons = {
  'play': playButton.src,
  'pause': pauseButton.src,
}

var audioCtx;
var audioSource;
var analyser;
var bufferLength;
var byteArray;
var floatArray;
var gain;
var bgHue;

var initialized = false;
var currentIndex = -1;
var currentTrack = new Audio();
var peakByte = 1;
var peakFloat = 1;
var delta = 5;
var lastLength = 0;
var lastRadius = 0;
var fftSize = 32;
var barWidth;

function Rat() {
  return currentTrack.currentTime / currentTrack.duration;
}

function initialize() {
  audioCtx = new AudioContext()
  audioSource = audioCtx.createMediaElementSource(currentTrack);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  // gain = audioCtx.createGain();
  
  analyser.fftSize = fftSize;
  bufferLength = analyser.frequencyBinCount;
  byteArray = new Uint8Array(bufferLength);
  floatArray = new Float32Array(analyser.fftSize); // Float32Array needs to be the same length as the fftSize
  
  initialized = true;
}

function playPause() {
  if (!initialized) {
    initialize();
  } 
  if (!currentTrack.src || currentTrack.ended) {
    currentIndex += 1;
    currentTrack.src = Object.values(audios)[currentIndex % len(audios)].src;
    peakByte = 1;
  }
  if (currentTrack.paused) {
    currentTrack.play();
  } else {
    currentTrack.pause();
  }
  setTitles();
  mode = (currentTrack.paused) ? 'play' : 'pause';
  setIcon(mode);
}

function increment(factor) {
  if (currentIndex + factor < 0) {
    currentIndex = trackCount - 1;
  } else if (currentIndex + factor >= trackCount) {
    currentIndex = 0;
  } else {
    currentIndex += factor;
  }
  return currentIndex;
}

function setPeaks() {
  max = maximum(byteArray);
  peakByte = (peakByte < max) ? max : peakByte;
  max = maximum(floatArray.map(Math.abs));
  peakFloat = (peakFloat < max) ? max : peakFloat;
  return peakByte;
}

function progressUpdate() {
  if (currentTrack) {
    if (!currentTrack.paused) {
      progctx = progressBar.getContext('2d');
      progctx.clearRect(0, 0, lastLength, progressBar.height);
      progctx.fillStyle = "#80bf40";
      lastLength = (currentTrack.currentTime / currentTrack.duration) * progressBar.width;
      progctx.fillRect(0, 0, lastLength, progressBar.height);
    }
  }
}

function setIcon(mode) {
  playButton.src = icons[mode]
}

function setTitles() {
  if (currentTrack) {
    if (currentTrack.paused) {
      pageTitle.innerHTML = 'vizzy';
      // trackNameBox.innerHTML = 'vizzy';
      // trackNameBox.style.visibility = 'hidden';
    } else {
      pageTitle.innerHTML = Object.keys(audios)[currentIndex % len(audios)];
      trackNameBox.innerHTML = Object.keys(audios)[currentIndex % len(audios)];
      trackNameBox.style.visibility = 'visible';
    }
  }
}

function fowind() {
  if (currentTrack) {
    if (currentTrack.currentTime < currentTrack.duration - delta) {
      currentTrack.currentTime += delta;
    }
  }
}

function rewind() {
  if (currentTrack) {
    if (currentTrack.currentTime > delta) {
      currentTrack.currentTime -= delta;
    }
  }
}

function prevNext(factor) {
  if (currentTrack) {
    currentTrack.pause();
  }
  increment(factor);
  currentTrack.src = Object.values(audios)[currentIndex % len(audios)].src;
  peakByte = 1;
  playPause();
}

function drawRotatingVisualizer(bufferLength, barWidth, byteArray, floatArray) {
  setPeaks();
  let max = maximum(byteArray);
  bgHue = 270 * (max / peakByte);
  ctx.clearRect(0, 0, sketchpad.width, sketchpad.height);
  sketchpad.style.background = hsl(bgHue, 100, 50);
  
  for (let i = 0; i < bufferLength; i += 1) {
    barHeight = byteArray[i];
    barWidth = barHeight * .02 
    
    sketchpad.style.background = hsl(360 - bgHue, 50, 50);
    
    ctx.save();
    ctx.translate(sketchpad.width/2, sketchpad.height/2);
    
    let rat = currentTrack.currentTime / currentTrack.duration;
    ctx.rotate(i / Math.PI + (8 + Math.asin(rat)));
    
    // let hue = i * Math.round(r2d(barHeight / peakByte));
    let pb = (peakByte == 0) ? .1 : peakByte;
    let hue = i * Math.round(r2d(barHeight / pb));
    // if (hue >= Infinity) {
      // console.log('hue error')
    // }
    // console.log(hue)
    hue = (hue > 360) ? 360 : hue;
    hue = (hue < 0) ? 0 : hue;
    ctx.fillStyle = hsl(hue, 20, 50);
    ctx.strokeStyle = rgb(0, 0, 0);
    
    ctx.strokeRect(0, 0, barWidth, barHeight * 1.2);
    ctx.fillRect(0, 0, barWidth, barHeight);
    
    ctx.restore();
  }
  drawCircle(floatArray);
  progressUpdate();
  
}

function drawCircle(floatArray) {
  let i = choice(range(len(floatArray)));
  let max = maximum(floatArray.map(Math.abs));
  let radius = 12;
  let hue = 360 * Math.round(r2d(radius / max)) / i;
  
  ctx.fillStyle = hsl(hue, 50, 50);
  ctx.arc(sketchpad.width/2, sketchpad.height/2, radius, 0, 2 * Math.PI);
  ctx.fill();
}

window.addEventListener('resize', function() {
  sketchpad.width = window.innerWidth;
  sketchpad.height = window.innerHeight;
});
sketchpad.addEventListener('click', function() {
  playPause();
})
currentTrack.addEventListener('ended', function(){
  prevNext(1);
});
playButton.addEventListener('click', function() {
  playPause();
  
  function animate(time) {
    if (time - lastFrame < dtFrame) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrame = time;
    ctx.clearRect(0, 0, sketchpad.width, sketchpad.height);
    analyser.getByteFrequencyData(byteArray);
    analyser.getFloatTimeDomainData(floatArray);
    drawRotatingVisualizer(bufferLength, barWidth, byteArray, floatArray);
    requestAnimationFrame(animate);
  }
  animate(currentTrack.currentTime);
});
pauseButton.addEventListener('click', function() {
  playPause();
});
nextButton.addEventListener('click', function(){
  prevNext(1);
});
prevButton.addEventListener('click', function(){
  prevNext(-1);
});
fowindButton.addEventListener('click', function(){
  fowind();
});
rewindButton.addEventListener('click', function(){
  rewind();
});
progressBar.addEventListener('click',  function(event){
  let location = progressBar.getBoundingClientRect();
  let rat = event.clientX - location.left;
  rat /= (location.right - location.left);
  currentTrack.currentTime = rat * currentTrack.duration;  
  progressUpdate();
});