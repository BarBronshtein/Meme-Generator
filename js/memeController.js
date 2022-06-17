'use strict';

let gCanvas;
let gCtx;
let gStartPos;
let gCurSelector = '.meme-gallery';
const gTouchEvs = ['touchstart', 'touchend', 'touchmove'];

function onInit() {
  renderGallery();
  gCanvas = document.querySelector('.canvas');
  gCtx = gCanvas.getContext('2d');
  resizeCanvas();
  window.onresize = resizeCanvas;
  addMouseListeners();
  addTouchListeners();
}

function resizeCanvas() {
  if (window.innerWidth < 780) {
    gCanvas.width = '300';
    gCanvas.height = '250';
  } else {
    gCanvas.width = '500';
    gCanvas.height = '500';
  }
}

function renderMeme(toRenderRect = true) {
  // We dont render rectangle around selected line only when the user uploads the canvas or downloads it
  //Draw the meme on the canvas
  const meme = getMeme();
  const memeImg = getImgById(meme.selectedImgId);
  const img = new Image();
  img.src = memeImg.url;
  img.onload = () => {
    drawImage(img);
    meme.lines.forEach(drawText);
    toRenderRect && drawRectOnSelectedLine();
  };
}

function drawRectOnSelectedLine() {
  const RECT_PADDING = 20;
  const meme = getMeme();
  const selectedLine = meme.lines[meme.selectedLineIdx];
  if (!selectedLine || !selectedLine.txt) return;
  const { lineWidth, lineHeight } = textSize(selectedLine.txt);
  setLineWidth(selectedLine, lineWidth);
  setLineHeight(selectedLine, lineHeight);
  gCtx.strokeRect(
    selectedLine.x - RECT_PADDING / 2,
    selectedLine.y,
    lineWidth + RECT_PADDING,
    -lineHeight
  );
}

function onSetLineTxt(txt) {
  let isNewLine = false;
  const meme = getMeme();
  const line = meme.selectedLineIdx;
  if (!meme.lines.length) {
    addLine();
    const line = meme.selectedLineIdx;
    const { lineWidth, lineHeight } = textSize(meme.lines[line].txt);
    setNewLinePos(gCanvas, lineWidth, lineHeight);
  }
  // If text user put is empty show write your meme
  // else calculate txt
  if (!txt) {
    txt = 'Write Your Meme';
    isNewLine = true;
  }
  setLineTxt(txt, line);

  renderMeme();
}

function textSize(txt) {
  const lineWidth = gCtx.measureText(txt).width;
  const lineHeight = gCtx.measureText('M').width;
  return { lineHeight, lineWidth };
}

function drawText({ x, y, colors, txt, size, font }) {
  // Drawing text
  gCtx.font = `${size}px ${font}`;
  gCtx.fillStyle = colors.fillColor;
  gCtx.strokeStyle = colors.strokeColor;
  gCtx.fillText(txt, x, y);
  gCtx.strokeText(txt, x, y);
}

function drawImage(img) {
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onAddLine() {
  const newLine = addLine();
  const { lineWidth, lineHeight } = textSize(newLine.txt);
  setNewLinePos(gCanvas, lineWidth, lineHeight);
  renderMeme();
  setInputValueTo();
}

function setInputValueTo(value = '') {
  const elTxt = document.querySelector('[name=text]');
  elTxt.value = value;
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

  elTxt.value = meme.lines.at(meme.selectedLineIdx).txt;

  if (elTxt.value === 'Write Your Meme') {
    elTxt.value = '';
  }
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
  const remainingLines = deleteLine();
  renderMeme();
  remainingLines || setInputValueTo();
}

function onSetAlignment(align) {
  setAlignment(align);
  const meme = getMeme();
  const { lineWidth } = textSize(meme.lines.at(meme.selectedLineIdx).txt);
  setLinePosX(gCanvas, lineWidth);
  renderMeme();
}

function show(selector, elBtn) {
  document.querySelector(gCurSelector).classList.add('hidden');
  document.querySelector(selector).classList.remove('hidden');
  document.querySelector('.meme-editor').classList.add('hidden');
  const elActive = document.querySelector('.active');
  elActive && elActive.classList.remove('active');
  elBtn?.classList.add('active');
  if (gCurSelector === '.meme-gallery') {
    document.querySelector('.share-container').innerHTML = '';
    resetMeme();
  }
  if (selector === '.saved-memes') {
    renderSavedMemes();
  }
  gCurSelector = selector;
}

function downloadImg(elLink) {
  renderMeme(false);
  const imgContent = gCanvas.toDataURL('image/jpeg'); // image/jpeg the default format
  elLink.href = imgContent;
}

// Upload canvas img
function uploadImg() {
  // Render image again without rectangle around selected line
  renderMeme(false);
  const imgDataUrl = gCanvas.toDataURL('image/jpeg'); // Gets the canvas content as an image format

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    //Encode the instance of certain characters in the url
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
    console.log(encodedUploadedImgUrl);
    document.querySelector(
      '.user-msg'
    ).innerText = `Your photo is available here: ${uploadedImgUrl}`;
    //Create a link that on click will make a post in facebook with the image we uploaded
    document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`;
  }
  //Send the image to the server
  doUploadImg(imgDataUrl, onSuccess);
}

function setGrabOn(ev) {
  // When user press mouse down or touch down canvas grabs text if its there
  // TODO:Find text to drag
  const pos = getEvPos(ev);
  if (!isLineClicked(pos)) return;
  setLineDrag(true);
  gStartPos = pos;
  renderMeme();
}

function setGrabOff() {
  setLineDrag(false);
}

function draw(ev) {
  const pos = getEvPos(ev);
  const meme = getMeme();
  if (!meme.lines.length || !meme.lines[meme.selectedLineIdx].isDrag) return;
  const dx = pos.x - gStartPos.x;
  const dy = pos.y - gStartPos.y;
  moveLine(dx, dy);
  gStartPos = pos;
  renderMeme();
}

function addMouseListeners() {
  gCanvas.addEventListener('mousedown', setGrabOn);
  gCanvas.addEventListener('mousemove', draw);
  gCanvas.addEventListener('mouseup', setGrabOff);
}

function addTouchListeners() {
  gCanvas.addEventListener('touchstart', setGrabOn);
  gCanvas.addEventListener('touchmove', draw);
  gCanvas.addEventListener('touchend', setGrabOff);
}

function getEvPos(ev) {
  //Gets the offset pos , the default pos
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  // Check if its a touch ev
  if (gTouchEvs.includes(ev.type)) {
    //so we will not trigger the mouse ev
    ev.preventDefault();
    //Gets the first touch point
    ev = ev.changedTouches[0];
    //Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function onCreateSticker(emoji) {
  const newLine = addLine();
  newLine.txt = emoji;
  const { lineWidth, lineHeight } = textSize(newLine.txt);
  setNewLinePos(gCanvas, lineWidth, lineHeight);
  renderMeme();
  setInputValueTo(emoji);
}

function renderEmojis() {
  const emojis = getEmojis();
  let html =
    '<span class="btn pagination-btn" onclick="onMoveTo(false)"><</span>';
  emojis.forEach(
    emoji =>
      (html += `<span onclick="onCreateSticker(this.textContent)" class="btn emoji-btn">${emoji}</span>`)
  );
  html += '<span class="btn pagination-btn" onclick="onMoveTo(true)">></span>';
  document.querySelector('.emojis').innerHTML = html;
}

function onMoveTo(toNextPage) {
  moveTo(toNextPage);
  renderEmojis();
}

function onSaveMeme() {
  saveMeme();
}

function toggleMenu(isOpen = false) {
  const elBtn = document.querySelector('.menu-toggle');
  if (elBtn.textContent === 'X' || isOpen) {
    elBtn.textContent = '☰';
    document.body.classList.remove('menu-open');
  } else {
    elBtn.textContent = 'X';
    document.body.classList.add('menu-open');
  }
}
