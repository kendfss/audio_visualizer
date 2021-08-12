const audioCtx = new AudioContext();
var initialized = false;
const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const audios = [amu, audio1];
var currentAudio = choice(audios);
var peak = 0;
const ctx = canvas1.getContext('2d');
let audioSource;
let analyser;
var fftSize = 64;
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
    currentAudio = choice(audios);
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
    audioSource = audioCtx.createMediaElementSource(currentAudio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    initialized = true;
  }
  analyser.fftSize = fftSize;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const barWidth = canvas.width / bufferLength;
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
    x = 9;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = setColour(barHeight);
      // ctx.fillStyle = colours[Math.round(colours.length * (barHeight / maximum(dataArray)))];
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      // ctx.fillRect(x, barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }
  animate();
});


// function drawVisualizer