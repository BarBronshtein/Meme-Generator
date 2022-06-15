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
      color: '#fff',
      x: 100,
      y: 20,
    },
  ],
  font: 'Impact',
};

function _createImg() {}

function addLine() {
  gMeme.selectedLineIdx++;

  gMeme.lines[gMeme.selectedLineIdx] = {
    txt: 'Write Your Meme',
    size: 25,
    align: 'center',
    color: '#fff',
    x: 0,
    y: 0,
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

function changeLine() {}
function deleteLine() {}

function setLinePosX(canvas, line, width) {
  const align = gMeme.lines.at(line).align;
  const pos = gMeme.lines.at(line);
  if (align === 'center') pos.x = (canvas.width - width) / 2;
  else if (align === 'left') pos.x = 20;
  else pos.x = canvas.width - 20 - width;
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

function setLineTxt(txt, line) {
  gMeme.lines.at(line).txt = txt;
}

function setImg(id) {
  gMeme.selectedImgId = +id;
}

function changeLine() {
  gMeme.selectedLineIdx =
    gMeme.selectedLineIdx === gMeme.lines.length - 1
      ? 0
      : gMeme.selectedLineIdx + 1;
  console.log(gMeme.selectedLineIdx);
}

function setFontSize(toIncrease) {
  // If increase is false decrease by one otherwise increment by 1
  gMeme.lines.at(gMeme.selectedLineIdx).size += toIncrease * 2 - 1;
}
function setColor(color) {
  gMeme.lines.at(gMeme.selectedLineIdx).color = color;
}
