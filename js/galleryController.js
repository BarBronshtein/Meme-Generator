'use strict';

function renderGallery() {
  const imgs = getImgs();
  let html = '';
  imgs.forEach(
    img =>
      (html += `<div onclick="onImgSelect('${img.id}')"><img src=${img.url}></div>`)
  );
  document.querySelector('.meme-gallery').innerHTML = html;
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
