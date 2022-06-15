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
    drawRectOnSelectedLine();
  };
}

function drawRectOnSelectedLine() {
  const meme = getMeme();
  const selectedLine = meme.lines[meme.selectedLineIdx];
  if (!selectedLine || !selectedLine.txt) return;
  const { lineHeight, lineWidth } = textSize(selectedLine.txt);
  gCtx.strokeRect(selectedLine.x, selectedLine.y, lineWidth, -lineHeight);
}
function onSetTextPos() {}

function onSetLineTxt(txt) {
  const meme = getMeme();
  if (!meme.lines.length) addLine();
  setLineTxt(txt, meme.selectedLineIdx);
  // Set text font and size
  // Get text width and height
  const { lineHeight, lineWidth } = textSize(txt);
  // Set line pos
  setLinePos(gCanvas, meme.selectedLineIdx, lineWidth, lineHeight);
  // Draw text on canvas
  renderMeme();
}

function textSize(txt) {
  const lineWidth = gCtx.measureText(txt).width;
  const lineHeight = gCtx.measureText('M').width;
  return { lineHeight, lineWidth };
}

function drawText({ x, y, color, txt, size, font }) {
  // Drawing text
  gCtx.font = `${size}px ${font}`;
  gCtx.fillStyle = color.fillColor;
  gCtx.strokeStyle = color.strokeColor;
  gCtx.fillText(txt, x, y);
  gCtx.strokeText(txt, x, y);
}

function drawImage(img) {
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onAddLine() {
  const meme = addLine();
  const newLine = meme.selectedLineIdx;
  const { lineHeight, lineWidth } = textSize(gMeme.lines.at(newLine).txt);
  setLinePos(gCanvas, newLine, lineWidth, lineHeight);
  renderMeme();
  const elTxt = document.querySelector('[name=text]');
  elTxt.value = '';
}

function onChangeLine() {
  changeLine();
  focus();
  renderMeme();
}
function focus() {
  const elTxt = document.querySelector('[name=text]');
  elTxt.focus();
  const meme = getMeme();

  if (meme.lines.at(meme.selectedLineIdx).txt !== 'Write Your Meme')
    elTxt.value = meme.lines.at(meme.selectedLineIdx).txt;

  if (!elTxt.value) return;
  elTxt.value = meme.lines.at(meme.selectedLineIdx).txt;
}

function onSetStrokeClr(color) {
  setStrokeClr(color);
  renderMeme();
}
function onSetFillClr(color) {
  setFillClr(color);
  renderMeme();
}

function onSetFontSize(toIncrease) {
  setFontSize(toIncrease);
  renderMeme();
}

function onDeleteLine() {
  deleteLine();
  renderMeme();
}

function showGallery() {
  document.querySelector('.meme-gallery').classList.remove('hidden');
  document.querySelector('.meme-editor').classList.add('hidden');
  renderMeme();
}
