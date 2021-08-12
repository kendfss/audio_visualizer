const playButton = document.getElementById('playButton');
const rewindButton = document.getElementById('rewindButton');
const forwardButton = document.getElementById('forwardButton');
const delta = 5;

let audio1 = new Audio();
audio1.src = './Iglooghost - Amu.flac';
// audio1.src = './break16-break01.wav';


const progressBar = document.getElementById('progressBar');
const progressWidth = progressBar.width;
var lastLength = 0;

playButton.addEventListener('click', function(){
  progressBar.style.visibility = 'visible';
  if (audio1.paused) {
    audio1.play();
    console.log(`Now playing "${audio1.src}"`);
  } else {
    audio1.pause();
    console.log(`Paused "${audio1.src}"`);
  };
  audio1.addEventListener('ended', function(){
    console.log(`"${audio1.src}" ended :(`);
  });
  progressUpdate();
});

rewindButton.addEventListener('click', function(){
  if (audio1.currentTime > delta) {
    audio1.currentTime -= delta;
  }
  progressUpdate();
})

forwardButton.addEventListener('click', function(){
  if (audio1.currentTime < audio1.duration - delta) {
    audio1.currentTime += delta;
  }
  progressUpdate();
});

function progressUpdate() {
    if (!audio1.paused) {
    ctx = progressBar.getContext('2d');
    ctx.clearRect(0, 0, lastLength, progressBar.height);
    ctx.fillStyle = 'skyblue';
    lastLength = (audio1.currentTime / audio1.duration) * progressBar.width;
    ctx.fillRect(0, 0, lastLength, progressBar.height);
  }
}


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
console.log(audioCtx);
const oscillatorButton = document.getElementById('oscillatorButton');

oscillatorButton.addEventListener('click', playSound);

function playSound() {
  const oscillator = audioCtx.createOscillator();
  oscillator.connect(audioCtx.destination);
  oscillator.type = document.getElementById('oscillatorShapes').value.toLowerCase();
  oscillator.start();
  setTimeout(function (){
    oscillator.stop();
  }, 1000);
}

