'use strict';

const gElImgContainer = document.querySelector('.img-container');
const gElSavedMemes = document.querySelector('.saved-memes');
const gElSearchKeys = document.querySelector('.key-search-words');
const gElFilterInput = document.querySelector("[name='filter']");
let gShowAllCategories = false;
function renderGallery() {
  const imgs = getImgs();
  let html = '';
  imgs.forEach(
    img =>
      (html += `<div onclick="onImgSelect('${img.id}')"><img src=${img.url}></div>`)
  );
  gElImgContainer.innerHTML = html;
  renderSearchWords(gShowAllCategories);
}

function onImgSelect(id) {
  gShowAllCategories = false;
  removeActiveStyleBtn();
  setImg(id);
  show('.meme-editor');
  renderEmojis();
  renderMeme();
}

function renderSavedMemes() {
  const memes = getSavedMemes();
  if (!memes || !memes.length) return;
  let html = '';
  memes.forEach(
    meme =>
      (html += `<div onclick="onMemeSelect('${meme.id}')"><img src="${meme.url}"></div>`)
  );
  gElSavedMemes.innerHTML = html;
}

function onMemeSelect(id) {
  gShowAllCategories = false;
  removeActiveStyleBtn();
  show('.meme-editor');
  setMemeToCurMeme(id);
  renderEmojis();
  renderMeme();
}

function removeActiveStyleBtn() {
  document.querySelector('.active').classList.remove('active');
}

function onSetFilterBy(txt) {
  setFilterBy(txt);
  renderGallery();
}

function renderSearchWords(showAll) {
  gShowAllCategories = showAll;
  const searchKeys = getSearchKeySearchCountMap();
  let html = '';
  const data = {};
  // Dynamically renders filter keywords
  for (const key in searchKeys) {
    html += `<span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${searchKeys[key]}">${key}</span>`;
    data[key] = searchKeys[key];
  }
  // Show only 3 categories if more btn isnot selected
  if (!showAll)
    html = `<span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${data.funny}">funny</span><span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${data.cat}">cat</span><span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${data.baby}">baby</span><span class="btn key-search-btn p2" onclick=renderSearchWords(true)>More...</span>`;

  gElSearchKeys.innerHTML = html;
  // Sets each category font size by popularity of clicks
  gElSearchKeys.childNodes.forEach(
    key => (key.style.fontSize = key.dataset.fs * 4 + 'px')
  );
}

function onMakeFsBigger(elSpan, key) {
  // Make selected key word bigger
  const fontSize = growKeySearchWord(key);
  elSpan.style.fontSize = fontSize * 4 + 'px';
  // Filter images by key word
  gElFilterInput.value = elSpan.textContent;
  setFilterBy(elSpan.textContent);
  renderGallery(gShowAllCategories);
}
