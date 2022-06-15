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
function addLine() {}
function deleteLine() {}

function setLinePosX(canvas, line, width, align) {
  if (align === 'center') gMeme.lines.at(line).x = (canvas.width - width) / 2;
  else if (align === 'left') gMeme.lines.at(line).x = 20;
  else gMeme.lines.at(line).x = canvas.width - 20 - width;
}
function setLinePosY(canvas, line, height) {
  if (!line) gMeme.lines.at(line).y = 20 + height;
  else if (line > 1) gMeme.lines.at(line).y = canvas.height - 20;
  else gMeme.lines.at(line).y = (canvas.height - height) / 2;
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
