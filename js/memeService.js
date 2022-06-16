'use strict';

let gKeywordSearchCountMap = { funny: 6, cat: 10, baby: 2 };
let gImgs = [
  { id: 1, url: 'img/meme-imgs/1.jpg' },
  { id: 2, url: 'img/meme-imgs/2.jpg' },
];
const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Write Your Meme',
      size: 25,
      align: 'center',
      color: { fillColor: '#fff', strokeColor: '#000' },
      x: 100,
      y: 20,
    },
  ],
  font: 'Impact',
};

function _createImgs() {
  // TODO: write functionallity
}

function setFontFamily(font) {
  gMeme.font = font;
}

function setTextPos(bringDown) {
  gMeme.lines[gMeme.selectedLineIdx].y += bringDown * 20 - 10;
}

function setAlignment(align) {
  gMeme.lines[gMeme.selectedLineIdx].align = align;
}

function addLine() {
  gMeme.selectedLineIdx++;

  gMeme.lines[gMeme.selectedLineIdx] = {
    txt: 'Write Your Meme',
    size: 25,
    align: 'center',
    color: { fillColor: '#fff', strokeColor: '#000' },
    x: 0,
    y: 20,
  };
  return gMeme;
}

function getImgs() {
  return gImgs;
}

function getImgById(id) {
  return gImgs.find(img => img.id === id);
}

function getMeme() {
  return gMeme;
}

function deleteLine() {
  gMeme.lines.length && gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  gMeme.selectedLineIdx > -1 ? gMeme.selectedLineIdx-- : '';
  if (gMeme.selectedLineIdx > -1 && gMeme.lines.length)
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function setLinePosX(canvas, line, width) {
  const align = gMeme.lines.at(line).align;
  const pos = gMeme.lines.at(line);
  if (align === 'center') pos.x = (canvas.width - width) / 2;
  else if (align === 'left') pos.x = 0;
  else pos.x = canvas.width - width;
}

function setLinePosY(canvas, line, height) {
  const pos = gMeme.lines.at(line);
  if (!line) pos.y = 20 + height;
  else if (line === 1) pos.y = canvas.height - 20;
  else pos.y = (canvas.height - height) / 2;
}

function setLinePos(canvas, line, width, height, align) {
  setLinePosX(canvas, line, width, align);
  setLinePosY(canvas, line, height);
}

function setLineTxt(txt, line, canvas, width, height, addNewLine) {
  gMeme.lines.at(line).txt = txt;
  if (addNewLine)
    setLinePos(canvas, line, width, height, gMeme.lines[line].align);
  else setLinePosX(canvas, line, width);
}

function setImg(id) {
  gMeme.selectedImgId = +id;
}

function changeLine() {
  gMeme.selectedLineIdx =
    gMeme.selectedLineIdx === gMeme.lines.length - 1
      ? 0
      : gMeme.selectedLineIdx + 1;
}

function setFontSize(toIncrease) {
  // If increase is false decrease by one otherwise increment by 1
  gMeme.lines.at(gMeme.selectedLineIdx).size += toIncrease * 2 - 1;
}
function setStrokeClr(color) {
  gMeme.lines.at(gMeme.selectedLineIdx).color.strokeColor = color;
}
function setFillClr(color) {
  gMeme.lines.at(gMeme.selectedLineIdx).color.fillColor = color;
}

function doUploadImg(imgDataUrl, onSuccess) {
  //Pack the image for delivery
  const formData = new FormData();
  formData.append('img', imgDataUrl);
  //Send a post req with the image to the server
  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  }) //Gets the result and extract the text/ url from it
    .then(res => res.text())
    .then(url => {
      console.log('Got back live url:', url);
      //Pass the url we got to the callBack func onSuccess, that will create the link to facebook
      onSuccess(url);
    })
    .catch(err => {
      console.error(err);
    });
}
