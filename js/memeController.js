'use strict';

let gCanvas;
let gCtx;

function onInit() {
  renderGallery();
  gCanvas = document.querySelector('.canvas');
  gCtx = gCanvas.getContext('2d');
  renderMeme();
}

function renderMeme() {
  //Draw the meme on the canvas
  const meme = getMeme();
  const memeImg = getImgById(meme.selectedImgId);
  const img = new Image();
  img.src = memeImg.url;
  img.onload = () => {
    drawImage(img);
    meme.lines.forEach(drawText);
  };
}

function onSetTextPos() {}

function onSetLineTxt(txt) {
  const meme = getMeme();

  setLineTxt(txt, meme.selectedLineIdx);
  // Set text font and size
  // Get text width and height
  const lineWidth = gCtx.measureText(txt).width;
  const lineHeight = gCtx.measureText('M').width;
  // Set line pos
  setLinePos(
    gCanvas,
    meme.selectedLineIdx,
    lineWidth,
    lineHeight,
    meme.lines.at(meme.selectedLineIdx).align
  );

  // Draw text on canvas
  renderMeme();
}

function onChangeLine() {}
function onAddLine() {}
function onDeleteLine() {}

function drawText({ x, y, color, txt, size, font }) {
  gCtx.font = `${size}px ${font}`;
  gCtx.fillStyle = color;
  gCtx.fillText(txt, x, y);
}

function drawImage(img) {
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

// function
