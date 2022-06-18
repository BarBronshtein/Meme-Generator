'use strict';

const gElSavedMemes = document.querySelector('.saved-memes');
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
  removeActiveStyleBtn();
  show('.meme-editor');
  setMemeToCurMeme(id);
  renderEmojis();
  renderMeme();
}
