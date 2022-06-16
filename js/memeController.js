'use strict';

let gCanvas;
let gCtx;
let gStartPos;
const gTouchEvs = ['touchstart', 'touchend', 'touchmove'];
function onInit() {
  renderGallery();
  gCanvas = document.querySelector('.canvas');
  gCtx = gCanvas.getContext('2d');
  renderMeme();
  addMouseListeners();
  addTouchListeners();
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
  if (!meme.lines.length) addLine();
  // If text user put is empty show write your meme
  // else calculate txt
  if (!txt) {
    txt = 'Write Your Meme';
    isNewLine = true;
  }

  const { lineWidth } = textSize(txt);
  setLineTxt(txt, meme.selectedLineIdx);
  // setLinePosX(gCanvas, meme.selectedLineIdx, lineWidth);

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
  const { lineWidth } = textSize(meme.lines.at(meme.selectedLineIdx).txt);
  // setLinePosX(gCanvas, meme.selectedLineIdx, lineWidth);
}

function drawImage(img) {
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onAddLine() {
  const meme = addLine();
  const newLine = meme.selectedLineIdx;
  const { lineWidth, lineHeight } = textSize(meme.lines.at(newLine).txt);
  setNewLinePos(gCanvas, newLine, lineWidth, lineHeight);
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
  deleteLine();
  renderMeme();
}

function onSetAlignment(align) {
  setAlignment(align);
  const meme = getMeme();
  const { lineWidth } = textSize(meme.lines.at(meme.selectedLineIdx).txt);
  setLinePosX(gCanvas, meme.selectedLineIdx, lineWidth);
  renderMeme();
}

function showGallery() {
  document.querySelector('.meme-gallery').classList.remove('hidden');
  document.querySelector('.meme-editor').classList.add('hidden');
  document.querySelector('.share-container').innerHTML = '';
  renderMeme();
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
  // When user press mouse up touch up or exits canvas territory drops text if grabbed
  setLineDrag(false);
}

function draw(ev) {
  const pos = getEvPos(ev);
  const meme = getMeme();
  if (!isLineClicked(pos) || !meme.lines[meme.selectedLineIdx].isDrag) return;
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
