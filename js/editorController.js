'use strict';

let gCanvas;
let gCtx;
let gStartPos;
let gTapped = false;
const gTouchEvs = ['touchstart', 'touchend', 'touchmove'];
const gElTxt = document.querySelector('[name=text]');
const gElMemeEditor = document.querySelector('.meme-editor');
const gElShareContainer = document.querySelector('.share-container');
const gElEmojis = document.querySelector('.emojis');
const gElSelectFontFamily = document.querySelector("[name='font-family']");

function createCanvas() {
  gCanvas = document.querySelector('.canvas');
  gCtx = gCanvas.getContext('2d');
}

function resizeCanvas() {
  if (window.innerWidth < 780) {
    gCanvas.width = '300';
    gCanvas.height = '250';
  } else {
    gCanvas.width = '500';
    gCanvas.height = '500';
  }
  gElMemeEditor.classList.contains('hidden') || renderMeme();
}

function renderMeme(toRenderRect = true) {
  // Set img as meme image id
  const meme = getMeme();
  const memeImg = getImgById(meme.selectedImgId);
  const img = new Image();

  img.src = memeImg.url;
  // On image load draw image draw lines
  img.onload = () => {
    drawImage(img);
    meme.lines.forEach(drawText);
    // Draws rectangle around if toRenderRect is false
    toRenderRect && drawRectOnSelectedLine();
  };
}
function drawRectOnSelectedLine() {
  const RECT_X_PADDING = 5;
  const selectedLine = getSelectedLine();
  if (!selectedLine) return;
  const { lineWidth, lineHeight } = textSize(selectedLine.txt);
  setLineWidth(selectedLine, lineWidth);
  setLineHeight(selectedLine, lineHeight);
  gCtx.strokeRect(
    selectedLine.x - RECT_X_PADDING / 2,
    selectedLine.y,
    lineWidth + RECT_X_PADDING,
    -lineHeight
  );
}

function onSetLineTxt(txt) {
  const meme = getMeme();
  const line = meme.selectedLineIdx;
  if (!meme.lines.length) {
    // Adds new line if there arent any and positining it accordingly
    addLine();
    const line = meme.selectedLineIdx;
    const { lineWidth, lineHeight } = textSize(meme.lines[line].txt);
    setNewLinePos(gCanvas, lineWidth, lineHeight);
  }
  // If text user put is empty show write your meme otherwise use given txt
  if (!txt) txt = 'Write Your Meme';
  setLineTxt(txt, line);

  renderMeme();
}

function drawText({ x, y, colors, txt, size, font }) {
  // Drawing text
  gCtx.font = `${size}px ${font}`;
  gCtx.fillStyle = colors.fillColor;
  gCtx.strokeStyle = colors.strokeColor;
  gCtx.fillText(txt, x, y);
  gCtx.strokeText(txt, x, y);
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
    //Create a link that on click will make a post in facebook with the image we uploaded
    gElShareContainer.innerHTML = `
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
  if (!isLineClicked(pos)) return renderMeme(false); // Wont render rectangle around text
  setInputFontFamilyTo();

  // Supporting dbl click on mobile to make inline editing
  if (
    (ev.type === 'click' && gTapped) ||
    (ev.type === 'touchstart' && gTapped)
  ) {
    gElBody.style.cursor = 'auto';
    gTapped = false;
    return focus();
  }
  if (ev.type === 'click') {
    gTapped = true;
    return setTimeout(() => (gTapped = false), 500);
  }
  gTapped = true;
  setTimeout(() => (gTapped = false), 500);
  // If text is selected make line drag to
  setLineDrag(true);
  gStartPos = pos;
  renderMeme();
  gElBody.style.cursor = 'grabbing';
}

function setGrabOff() {
  setLineDrag(false);
}

function draw(ev) {
  gElBody.style.cursor = 'grab';
  const pos = getEvPos(ev);
  const meme = getMeme();
  if (!meme.lines.length || !meme.lines[meme.selectedLineIdx].isDrag) return;
  // Moves selected text
  gElBody.style.cursor = 'grabbing';
  const dx = pos.x - gStartPos.x;
  const dy = pos.y - gStartPos.y;
  gStartPos = pos;
  moveLine(dx, dy);
  renderMeme();
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

function renderEmojis() {
  const emojis = getEmojis();
  let html =
    '<span class="btn pagination-btn" onclick="onMoveTo(false)"><</span>';
  emojis.forEach(
    emoji =>
      (html += `<span onclick="onAddLine(this.textContent)" class="btn emoji-btn">${emoji}</span>`)
  );
  html += '<span class="btn pagination-btn" onclick="onMoveTo(true)">></span>';
  gElEmojis.innerHTML = html;
}

function textSize(txt) {
  const lineWidth = gCtx.measureText(txt).width;
  const lineHeight = gCtx.measureText('M').width;
  return { lineHeight, lineWidth };
}

function drawImage(img) {
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onAddLine(emoji = '') {
  const newLine = addLine();
  if (emoji) newLine.txt = emoji;
  const { lineWidth, lineHeight } = textSize(newLine.txt);
  setNewLinePos(gCanvas, lineWidth, lineHeight);
  renderMeme();
  setInputValueTo(emoji);
}

function onChangeLine() {
  changeLine();
  focus();
  setInputFontFamilyTo();
  renderMeme();
}
function setInputFontFamilyTo() {
  const selectedLine = getSelectedLine();
  gElSelectFontFamily.value = selectedLine.font;
}

function focus() {
  gElTxt.focus();
  const selectedLine = getSelectedLine();
  gElTxt.value = selectedLine.txt;
  // Clears input when user start typing when txt is set to default
  if (gElTxt.value === 'Write Your Meme') {
    gElTxt.value = '';
  }
}

function onSetStrokeClr(color) {
  setStrokeClr(color);
  renderMeme();
}

function setInputValueTo(value = '') {
  gElTxt.value = value;
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
  // clears input text if there are no remaining lines
  remainingLines || setInputValueTo();
}

function onSetAlignment(align) {
  setAlignment(align);
  const selectedLine = getSelectedLine();
  const { lineWidth } = textSize(selectedLine.txt);
  setLinePosX(gCanvas, lineWidth);
  renderMeme();
}

function onMoveTo(toNextPage) {
  moveTo(toNextPage);
  renderEmojis();
}

function onSaveMeme() {
  saveMeme();
}

function addMouseListeners() {
  gCanvas.addEventListener('mousedown', setGrabOn);
  gCanvas.addEventListener('click', setGrabOn);
  gCanvas.addEventListener('mousemove', draw);
  gCanvas.addEventListener('mouseup', setGrabOff);
}

function addTouchListeners() {
  gCanvas.addEventListener('touchstart', setGrabOn);
  gCanvas.addEventListener('touchmove', draw);
  gCanvas.addEventListener('touchend', setGrabOff);
}

function resetShareContainer() {
  gElShareContainer.innerHTML = '';
}
