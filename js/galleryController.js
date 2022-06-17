'use strict';

function renderGallery() {
  const imgs = getImgs();
  let html = '';
  imgs.forEach(
    img =>
      (html += `<div onclick="onImgSelect('${img.id}')"><img src=${img.url}></div>`)
  );
  document.querySelector('.img-container').innerHTML = html;
  renderSearchWords();
}

function onImgSelect(id) {
  setImg(id);
  document.querySelector('.meme-gallery').classList.add('hidden');
  document.querySelector('.meme-editor').classList.remove('hidden');
  renderEmojis();
  renderMeme();
}

function renderSavedMemes() {
  const memes = getSavedMemes();
  if (!memes || !memes.length) return;
  let html = '';
  memes.forEach(
    meme =>
      (html += `<div onclick="onMemeSelect('${meme.id}')"><img src=${meme.url}></div>`)
  );
  document.querySelector('.saved-memes').innerHTML = html;
}

function onMemeSelect(id) {
  document.querySelector('.saved-memes').classList.add('hidden');
  document.querySelector('.meme-editor').classList.remove('hidden');
  setMemeToCurMeme(id);
  renderEmojis();
  renderMeme();
}

function onSetFilterBy(txt) {
  setFilterBy(txt);
  renderGallery();
}

function renderSearchWords() {
  const searchKeys = getSearchKeySearchCountMap();
  let html = '';
  for (const key in searchKeys) {
    html += `<span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${searchKeys[key]}">${key}</span>`;
  }
  const elSearchKeys = document.querySelector('.key-search-words');
  elSearchKeys.innerHTML = html;
  elSearchKeys.childNodes.forEach(
    key => (key.style.fontSize = key.dataset.fs * 4 + 'px')
  );
}

function onMakeFsBigger(elSpan, key) {
  // Make selected key word bigger
  const fontSize = growKeySearchWord(key);
  elSpan.style.fontSize = fontSize * 4 + 'px';
  // Filter images by key word
  document.querySelector('[name=filter]').value = elSpan.textContent;
  onSetFilterBy(elSpan.textContent);
}
