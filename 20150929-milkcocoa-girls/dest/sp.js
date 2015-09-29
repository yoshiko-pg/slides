'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
var ds = milkcocoa.dataStore('slide/20150929');
var id = makeId();

var voteOptions = document.querySelector('.vote ul');

// リアクション送信
var buttons = [].concat(_toConsumableArray(document.querySelectorAll('.reaction-btn')));
Bacon.fromArray(buttons).flatMap(function (e) {
  return Bacon.fromEventTarget(e, 'click');
}).map(function (e) {
  return e.target.value;
}).onValue(function (value) {
  return ds.send({ to: 'pc', type: value });
});

// 投票送信
Bacon.fromBinder(function (callback) {
  window.vote = callback;
  (function () {
    return window.vote = null;
  });
}).onValue(function (value) {
  return ds.send({ to: 'pc', vote: value, id: id });
});

// メッセージ送信
Bacon.fromBinder(function (callback) {
  window.send = function () {
    callback();return false;
  };
  (function () {
    return window.send = null;
  });
}).onValue(function () {
  var commentEl = document.getElementById('comment');
  ds.send({ to: 'pc', message: commentEl.value });
  commentEl.value = '';
});

// モード変更
var stream = Bacon.fromBinder(function (callback) {
  ds.on('send', callback);
  (function () {
    return ds.off('send');
  });
}).filter(function (data) {
  return data.value.to == 'sp';
});

stream.map(function (data) {
  return data.value.mode;
}).onValue(function (mode) {
  document.getElementsByClassName('showing')[0].classList.remove('showing');
  document.getElementsByClassName(mode)[0].classList.add('showing');
});

stream.filter(function (data) {
  return data.value.mode == 'vote' && data.value.items;
}).map(function (data) {
  return data.value.items;
}).onValue(function (items) {
  voteOptions.innerHTML = '';
  items.forEach(function (item, index) {
    var li = document.createElement('li');
    var radio = document.createElement('input');
    var label = document.createElement('label');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'vote');
    radio.setAttribute('id', 'vote-' + index);
    radio.setAttribute('value', item);
    radio.setAttribute('onchange', 'window.vote(this.value)');
    label.setAttribute('for', 'vote-' + index);
    label.textContent = item;
    li.appendChild(radio);
    li.appendChild(label);
    voteOptions.appendChild(li);
    drawRadioSvg();
  });
});

function makeId() {
  var randam = Math.floor(Math.random() * 1000);
  var date = new Date();
  var time = date.getTime();
  return randam + time.toString();
}