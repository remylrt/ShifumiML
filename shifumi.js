let shifumiClassifier;
let video;
let flippedVideo;
const width = 360;
const height = 280;
let canvas, ctx;

const signs = ['Rock', 'Paper', 'Scissors'];
let playerSign = '';
let botSign = '';
let seconds = 5;

async function make() {
  video = await getVideo();

  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");

  shifumiClassifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/hjtb1jjRq/model.json', modelReady);
}

async function getVideo() {
  const videoElement = document.createElement("video");
  videoElement.setAttribute("style", "display: none;");
  videoElement.width = width;
  videoElement.height = height;
  document.getElementById('cam').appendChild(videoElement);

  const capture = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = capture;
  videoElement.play();

  return videoElement;
}

function createCanvas(wight, height) {
  const canvas = document.createElement("canvas");
  canvas.width = wight;
  canvas.height = height;
  document.getElementById('cam').appendChild(canvas);
  return canvas;
}

function modelReady() {
  console.log("Model ready!");
  classify();
}

function classify() {
  flippedVideo = ml5.flipImage(video)
  shifumiClassifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(video, 0, 0, width, height);
  
  document.getElementById('rock').innerHTML = 'Rock: ' + getConfidence(results, 'Rock') + '%';
  document.getElementById('paper').innerHTML = 'Paper: ' +getConfidence(results, 'Paper') + '%';
  document.getElementById('scissors').innerHTML = 'Scissors :' +getConfidence(results, 'Scissors') + '%';

  playerSign = results[0].label;
  
  classify();
}

window.addEventListener("DOMContentLoaded", function() {
  make();
});

function play() {
  let playButton = document.getElementById('playButton');

  document.getElementById('playerSign').innerHTML = 'You did:';
  document.getElementById('botSign').innerHTML = 'Bot did:';
  document.getElementById('result').innerHTML = 'Result: Do your sign !';

  playButton.classList.add('pulse');

  let timer = setInterval(() => {
   if (seconds > 0) {
      playButton.innerHTML = seconds;
      seconds--;
   } else {
      clearInterval(timer);
      seconds = 5;
      playButton.classList.remove('pulse');
      playButton.innerHTML = '<i class="large material-icons">play_arrow</i>';

      getSigns();
   }
  }, 1000);
}

function getSigns() {
  botSign = signs[Math.floor(Math.random() * signs.length)];

  document.getElementById('playerSign').innerHTML = 'You did: ' + playerSign + ' ' + getEmoji(playerSign);
  document.getElementById('botSign').innerHTML = 'Bot did: ' + botSign + ' ' + getEmoji(botSign);

  getResult();
}

function getResult() {
  let result = document.getElementById('result');

  if(playerSign === botSign){
    result.innerHTML = 'Result: Draw ' + getEmoji('Draw');
  }else if((playerSign === 'Rock' && botSign === 'Scissors') || (playerSign === 'Paper' && botSign === 'Rock') || (playerSign === 'Scissors' && botSign === 'Paper')){
    result.innerHTML = 'Result: You win ' + getEmoji('Win');
  }else{
    result.innerHTML = 'Result: Bot wins ' + getEmoji('Lose');
  }
}

function getConfidence(predictionResult, sign) {
  let confidence;

  for (let i = 0; i < signs.length; i++) {
    if(predictionResult[i].label === sign){
      confidence = parseFloat(predictionResult[i].confidence) * 100;
      break;
    }
  }

  return confidence.toFixed(2);
}

function getEmoji(name){
  switch (name) {
    case 'Rock':
      return '✊';
      break;

    case 'Paper':
      return '🤚';
      break;

    case 'Scissors':
      return '✌';
      break;

    case 'Win':
      return '😄';
      break;

    case 'Lose':
      return '😕';
      break;

    case 'Draw':
      return '😅';
      break;
  }
}