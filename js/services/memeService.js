'use strict';

let gKeywordSearchCountMap = {
  funny: 6,
  animals: 10,
  baby: 2,
  politics: 5,
  cute: 3,
};
let gImgs = [
  { id: 1, url: 'img/meme-imgs/1.jpg' },
  { id: 2, url: 'img/meme-imgs/2.jpg' },
];
const gFilterBy = { txt: '' };
let gSavedMemes = [];
const gEmojis = [
  '🍕',
  '🥑',
  '😶‍🌫️',
  '☠️',
  '👺',
  '🤡',
  '🐸',
  '👅',
  '🦷',
  '👁️',
  '🗣️',
  '🎁',
  '💍',
  '🥇',
  '🥊',
];
const EMOJI_PER_PAGE = 3;
const gPages = {
  curPage: 0,
  numPages: 4,
};
const STORAGE_KEY = 'memesDB';

let gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Write Your Meme',
      size: 25,
      align: 'center',
      colors: { fillColor: '#fff', strokeColor: '#000' },
      x: 100,
      y: 35,
      isDrag: false,
      font: 'Impact',
    },
  ],
  font: 'impact',
};

_createImgs();

function _createImgs() {
  // TODO: write functionallity
  const imgs = [];
  for (let i = 1; i < 19; i++) {
    const img = _createImg(i);
    imgs.push(img);
  }
  gImgs = imgs;
}

function _createImg(i) {
  return {
    id: i,
    url: `img/meme-imgs/${i}.jpg`,
    categories: ['funny'], // TODO:replace with a function that create random categories based on a stock of categories
  };
}

function setFontFamily(font) {
  gMeme.lines[gMeme.selectedLineIdx].font = font;
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
  return (gMeme.lines[gMeme.selectedLineIdx] = {
    txt: 'Write Your Meme',
    size: 25,
    align: 'center',
    colors: { fillColor: '#fff', strokeColor: '#000' },
    x: 0,
    y: 20,
    isDrag: false,
    font: gMeme.font,
  });
}

function getImgs() {
  const imgs = gImgs.filter(img =>
    img.categories.every(c => c.includes(gFilterBy.txt))
  );
  return imgs;
}

function getImgById(id) {
  return gImgs.find(img => img.id === +id);
}

function getMeme() {
  return gMeme;
}

function saveMeme() {
  console.log(gSavedMemes);
  gSavedMemes.push(gMeme);
  gSavedMemes.at(-1).url = '';
  gSavedMemes.at(-1).url = getImgById(gSavedMemes.at(-1).selectedImgId).url;
  gSavedMemes.at(-1).id = makeId();
  saveToStorage(STORAGE_KEY, gSavedMemes);
}

function getSavedMemes() {
  gSavedMemes = loadFromStorage(STORAGE_KEY);
  if (!gSavedMemes) return (gSavedMemes = []);
  return gSavedMemes;
}

function deleteLine() {
  gMeme.lines.length && gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  gMeme.selectedLineIdx > -1 ? gMeme.selectedLineIdx-- : '';
  if (gMeme.selectedLineIdx > -1 && gMeme.lines.length)
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
  return gMeme.lines.length;
}

function setLinePosX(canvas, width) {
  const line = gMeme.selectedLineIdx;
  const align = gMeme.lines.at(line).align;
  const pos = gMeme.lines.at(line);
  if (align === 'center') pos.x = (canvas.width - width) / 2;
  else if (align === 'left') pos.x = 0;
  else pos.x = canvas.width - width;
}

function setLinePosY(canvas, height) {
  const line = gMeme.selectedLineIdx;
  const pos = gMeme.lines.at(line);
  // First line
  if (!line) pos.y = 20 + height;
  // Second line
  else if (line === 1) pos.y = canvas.height - 20;
  // Third and above
  else pos.y = (canvas.height - height) / 2;
}

function setNewLinePos(canvas, width, height) {
  // Sets position in creation of a new line
  setLinePosX(canvas, width);
  setLinePosY(canvas, height);
}

function setLineTxt(txt, line) {
  gMeme.lines.at(line).txt = txt;
}

function setImg(id) {
  gMeme.selectedImgId = id;
}

function changeLine() {
  gMeme.selectedLineIdx =
    gMeme.selectedLineIdx === gMeme.lines.length - 1
      ? 0
      : gMeme.selectedLineIdx + 1;
}

function setFontSize(toIncrease) {
  // true value equals 1 in js and false equals to 0
  // The ratio need to be 2:1 to increase and decrease by the same value
  gMeme.lines.at(gMeme.selectedLineIdx).size += toIncrease * 2 - 1;
}
function setStrokeClr(color) {
  gMeme.lines.at(gMeme.selectedLineIdx).colors.strokeColor = color;
}
function setFillClr(color) {
  gMeme.lines.at(gMeme.selectedLineIdx).colors.fillColor = color;
}

function setLineHeight(line, height) {
  line.height = height;
}
function setLineWidth(line, width) {
  line.width = width;
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
    .then(url =>
      //Pass the url we got to the callBack func onSuccess, that will create the link to facebook
      onSuccess(url)
    )
    .catch(err => {
      console.error(err);
    });
}

function isLineClicked(clickedPos) {
  const { x: clickedX, y: clickedY } = clickedPos;
  const idx = gMeme.lines.findIndex(
    line =>
      clickedX >= line.x &&
      clickedX <= line.x + line.width &&
      clickedY >= line.y - line.height &&
      clickedY <= line.y
  );
  // If no matches exit
  if (idx === -1) return false;
  // Set selected line to matched line index
  gMeme.selectedLineIdx = idx;
  setInputFontFamilyTo();
  return true;
}

function setLineDrag(isDrag) {
  gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag;
}

function moveLine(dx, dy) {
  const pos = gMeme.lines[gMeme.selectedLineIdx];
  pos.x += dx;
  pos.y += dy;
}

function resetMeme() {
  gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'Write Your Meme',
        size: 25,
        align: 'center',
        colors: { fillColor: '#fff', strokeColor: '#000' },
        x: 100,
        y: 35,
        isDrag: false,
      },
    ],
    font: 'Impact',
  };
}

function getEmojis() {
  const pageOn = gPages.curPage * EMOJI_PER_PAGE;
  return gEmojis.slice(pageOn, pageOn + EMOJI_PER_PAGE);
}

function moveTo(toNextPage) {
  // Last page going forward
  if (toNextPage && gPages.curPage === gPages.numPages)
    return (gPages.curPage = 0);
  // other going forward
  if (toNextPage) return gPages.curPage++;
  // First page going backwards
  if (!toNextPage && gPages.curPage === 0)
    return (gPages.curPage = gPages.numPages);
  // other going backwards
  gPages.curPage--;
}

function setMemeToCurMeme(id) {
  const meme = gSavedMemes.find(meme => meme.id === id);
  if (!meme) return;
  gMeme = meme;
}

function setFilterBy(txt) {
  gFilterBy.txt = txt;
}

function getSearchKeySearchCountMap() {
  return gKeywordSearchCountMap;
}

function growKeySearchWord(key) {
  return gKeywordSearchCountMap[key]++;
}
