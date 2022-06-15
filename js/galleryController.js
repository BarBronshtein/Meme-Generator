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
  renderMeme();
}
