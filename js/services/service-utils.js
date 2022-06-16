'use strict';

function makeId(length = 6) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var txt = '';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}
function getRandIntInc(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.trunc(Math.random() * (max - min + 1) + min);
}
