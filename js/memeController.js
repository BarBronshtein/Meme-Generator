'use strict';

let gCurSelector = '.meme-gallery';
const gElBtn = document.querySelector('.menu-toggle');
const gElBody = document.body;
function onInit() {
  renderGallery();
  createCanvas();
  resizeCanvas();
  window.onresize = resizeCanvas;
  addMouseListeners();
  addTouchListeners();
}

function show(newSelector, elBtn) {
  setShowAllCategories(false);
  // Hiding prev section and showing new section
  document.querySelector(gCurSelector).classList.add('hidden');
  document.querySelector(newSelector).classList.remove('hidden');
  gCurSelector = newSelector;

  if (newSelector !== '.meme-editor') {
    // Sets active class om button
    const elActive = document.querySelector('.active');
    elActive?.classList.remove('active');
    elBtn?.classList.add('active');
    // Reset meme
    setInputValueTo();
    resetShareContainer();
    resetMeme();
    setInputFontFamilyTo();
  }
  if (newSelector === '.saved-memes') renderSavedMemes();
  if (newSelector === '.meme-gallery') renderGallery();
  toggleMenu(true);
}

function toggleMenu(isOpen = false) {
  if (gElBtn.textContent === 'X' || isOpen) {
    gElBtn.textContent = '☰';
    gElBody.classList.remove('menu-open');
  } else {
    gElBtn.textContent = 'X';
    gElBody.classList.add('menu-open');
  }
}

function cursorNormal() {
  gElBody.style.cursor = 'default';
}

function removeActiveStyleBtn() {
  document.querySelector('.active')?.classList.remove('active');
}
