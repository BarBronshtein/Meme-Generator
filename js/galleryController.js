'use strict';

const gElImgContainer = document.querySelector('.img-container');

const gElSearchKeys = document.querySelector('.key-search-words');
const gElFilterInput = document.querySelector("[name='filter']");
let gShowAllCategories = false;
function renderGallery() {
  const imgs = getImgs();
  let html = `<div class="user-img-container"><input onchange="onImgInput(event)" class="btn user-img" type="file" name="file" /></div>`;
  imgs.forEach(
    img =>
      (html += `<div onclick="onImgSelect('${img.id}')"><img src=${img.url}></div>`)
  );
  gElImgContainer.innerHTML = html;
  renderSearchWords(gShowAllCategories);
}

function renderSearchWords(showAll) {
  setShowAllCategories(showAll);
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
    html = `<span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${data.funny}">funny</span><span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${data.animals}">animals</span><span class="btn key-search-btn p2" onclick=onMakeFsBigger(this,this.textContent) data-fs="${data.baby}">baby</span><span class="btn key-search-btn p2" onclick=renderSearchWords(true)>More...</span>`;

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

// CallBack func will run on success load of the img
function loadImageFromInput(ev) {
  var reader = new FileReader();
  //After we read the file
  reader.onload = function (event) {
    var img = new Image(); // Create a new html img element
    img.src = event.target.result; // Set the img src to the img file we read
    //Run the callBack func , To render the img on the canvas
    img.onload = () => {
      addImg(img.src);
      drawImage(img);
    };
  };
  reader.readAsDataURL(ev.target.files[0]); // Read the file we picked
}

function setShowAllCategories(value) {
  gShowAllCategories = value;
}

function onImgInput(ev) {
  console.log('hi');
  loadImageFromInput(ev);
  show('.meme-editor');
}

function onImgSelect(id) {
  removeActiveStyleBtn();
  setImg(id);
  show('.meme-editor');
  renderEmojis();
  renderMeme();
}

function onSetFilterBy(txt) {
  setFilterBy(txt);
  renderGallery();
}
