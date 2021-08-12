var audioCtx;
var initialized = false;
const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// const audios = [amu, audio1];
// const audios = [oh, three_hours, bisto, bleeding_heart, juliet, fakie_blips, klaar, audio2, distilled__remix_];
var currentAudio = choice(audios);
// console.log(currentAudio);
// var currentAudio = amu;
var peak = 1;
const ctx = canvas1.getContext('2d');
var audioSource;
var analyser;
var bufferLength;
var dataArray;
var fftSize = 32;
var barWidth = 6;
// [ "#98FB98", "#FF7F50", "#B8860B", "#7B68EE", "#556B2F", "#708090" ]
// [ "#90EE90", "#FF6347", "#FF8C00", "#708090", "#A9A9A9", "#E9967A" ]
var colours = sample(
  Object.keys(
    // hexes_names
    names_hexes
  ),
  6,
  true
);
// var colours = 'white wheat mediumseagreen aqua magenta black'.split(' ');
// const colours = Object.keys(require("./names_hexes.js"));
// const colours = fetch("./names_hexes.js").then(response => {
  // return response.json();
// }).then(data => console.log(data))

function togglePlayback() {
  if (currentAudio.ended) {
    currentAudio.mediaElement = choice(audios);
    peak = 0;
  }
  if (currentAudio.paused) {
    currentAudio.play();
  } else {
    currentAudio.pause();
  }
}

function setPeak(bars) {
  for (bar of bars) {
    peak = (peak < bar) ? bar : peak;
  }
}

container.addEventListener('click', function(){
  
  togglePlayback();
  
  if (!initialized) {
    audioCtx = new AudioContext();
    audioSource = audioCtx.createMediaElementSource(currentAudio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    initialized = true;
  }
  analyser.fftSize = fftSize;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  
  // const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x = 0;
  
  function setColour(barHeight) {
    setPeak(dataArray);
    // let i = Math.round(colours.length * (barHeight / maximum(dataArray)));
    let i = Math.round(colours.length * (barHeight / peak));
    if (i > colours.length - 1) {
      i = colours.length - 1
    } else if (i < 0) {
      i = 0
    }
    // i -= ((colours.length === i) ? 1 : 0);
    // i += ((0 > i) ? 1 : 0);
    // console.log([i, colours[i], barHeight, colours.length]);
    return colours[i];
  }

  
  function animate() {
    x = 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    // drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    drawRotatingVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});


function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  setPeak(dataArray)
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    ctx.fillStyle = hsl((barHeight/ peak) * 270, 100, 50);
    // ctx.fillStyle = colours[Math.round(colours.length * (barHeight / maximum(dataArray)))];
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    // ctx.fillRect(x, barHeight, barWidth, barHeight);
    x += barWidth;
  }  
}

function drawRotatingVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  setPeak(dataArray)
  canvas1.style.background = hsl(peak, 50, 12);
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] + 100;
    // barHeight = dataArray[i] + 12;
    canvas1.style.background = hsl(270 * ((barHeight - 83) / peak), 50, 5);
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    // ctx.rotate(i * Math.PI * 8 * currentAudio.currentTime/ bufferLength);
    ctx.rotate(-i * Math.PI * 8 * (currentAudio.currentTime / currentAudio.duration)/ bufferLength);
    // ctx.rotate(i + Math.PI * 2/ bufferLength);
    // let hue = Math.round((barHeight / peak) * 270);
    let hue = Math.round(r2d(barHeight / peak));
    ctx.fillStyle = hsl(hue, 50, 50 * (barHeight / peak));
    ctx.strokeStyle = hsl(hue, 50 * (barHeight / peak), 50);
    // ctx.fillStyle = hsl(i * 15, 100, 50);
    // ctx.fillStyle = colours[Math.round(colours.length * (barHeight / maximum(dataArray)))];
    // ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    // ctx.fillRect(x, barHeight, barWidth, barHeight);
    // ctx.strokeRect(0, barHeight, barWidth, barHeight);
    ctx.fillRect(0, 0, barWidth, barHeight);
    ctx.strokeRect(0, barHeight, barWidth, barHeight);
    x += barWidth / 2;
    ctx.restore();
  }  
}

// peak.addEventListener('change', function() {
  // canvas1.style.background = hsl(360 - peak, 50, 50);
// });