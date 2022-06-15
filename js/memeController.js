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
  const rectPadding = 20;
  const meme = getMeme();
  const selectedLine = meme.lines[meme.selectedLineIdx];
  if (!selectedLine || !selectedLine.txt) return;
  const { lineHeight, lineWidth } = textSize(selectedLine.txt);
  gCtx.strokeRect(
    selectedLine.x - rectPadding / 2,
    selectedLine.y,
    lineWidth + rectPadding,
    -lineHeight
  );
}

function onSetLineTxt(txt) {
  const meme = getMeme();
  if (!meme.lines.length) addLine();
  setLineTxt(txt, meme.selectedLineIdx);
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
  // Set x position
  const meme = getMeme();
  const { lineHeight, lineWidth } = textSize(
    gMeme.lines.at(gMeme.selectedLineIdx).txt
  );
  setLinePosX(gCanvas, gMeme.selectedLineIdx, lineWidth, lineHeight);
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

function onSetFontFamily(font) {
  setFontFamily(font);
  renderMeme();
}

function onSetFillClr(color) {
  setFillClr(color);
  renderMeme();
}

function onSetTextPos(bringDown) {
  setTextPos(bringDown);
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

function onSetAlignment(align) {
  console.log(align);
  setAlignment(align);
  const meme = getMeme();
  const { lineHeight, lineWidth } = textSize(
    gMeme.lines.at(gMeme.selectedLineIdx).txt
  );
  setLinePosX(gCanvas, gMeme.selectedLineIdx, lineWidth, lineHeight);
  renderMeme();
}

function showGallery() {
  document.querySelector('.meme-gallery').classList.remove('hidden');
  document.querySelector('.meme-editor').classList.add('hidden');
  renderMeme();
}
