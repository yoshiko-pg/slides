'use strict';

(function () {
  'use strict';

  var milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
  var ds = milkcocoa.dataStore('slide/20150929');
  var currentPage = undefined;

  // スマートフォン側の表示変更
  talkie.changed.onValue(function () {
    return ds.send({ to: 'sp', mode: 'reactions' });
  });
  talkie.changed.filter(function (current) {
    return current.hasAttribute('end');
  }).log().onValue(function (current) {
    return ds.send({ to: 'sp', mode: 'end' });
  });
  talkie.changed.filter(function (current) {
    return current.hasAttribute('vote');
  }).onValue(function (current) {
    var items = [];
    var itemElems = current.getElementsByTagName('LI');
    for (var i = 0; i < itemElems.length; i++) {
      items.push(itemElems[i].innerText);
    }
    ds.send({ to: 'sp', mode: 'vote', items: items });
    currentPage = current;
  });

  // スマートフォンからのデータの受信
  var stream = Bacon.fromBinder(function (callback) {
    ds.on('send', callback);
    (function () {
      return ds.off('send');
    });
  }).filter(function (data) {
    return data.value.to == 'pc';
  });

  // スライド上にリアクション表示
  stream.map(function (data) {
    switch (data.value.type) {
      case 'like':
        return makeLikeFn();
      case 'kwsk':
        return makeKwskFn();
      case 'cheer':
        return makeCheerFn();
      case 'www':
        return makeMarqueeFn('wwwww');
      case 'clap':
        return makeMarqueeFn('88888888888888');
      default:
        return makeMarqueeFn(data.value.message);
    }
  }).onValue(function (fn) {
    var el = fn();
    showAndRemove(el);
  });

  // 投票
  stream.filter(function (data) {
    return data.value.vote;
  }).onValue(function (data) {
    var stamped = document.getElementById(data.value.id);
    if (stamped) {
      stamped.parentNode.setAttribute('count', stamped.parentNode.getAttribute('count') - 1);
      stamped.parentNode.removeChild(stamped);
    }

    var items = currentPage.getElementsByTagName('LI');
    for (var i = 0; i < items.length; i++) {
      if (items[i].innerText == data.value.vote) {
        var stamp = document.createElement('span');
        stamp.classList.add('stamp');
        stamp.setAttribute('id', data.value.id);
        items[i].appendChild(stamp);
        var stampCount = items[i].querySelectorAll('.stamp').length;
        items[i].setAttribute('count', stampCount);
      }
    }
  });

  function makeMarqueeFn(text) {
    return function () {
      var el = document.createElement('div');
      el.textContent = text;
      el.classList.add('marquee');
      el.style.top = getRandPer() + '%';
      return el;
    };
  }

  function makeCheerFn() {
    var cheers = ['ｷｬｰ', 'ｶﾞﾝﾊﾞﾚｰ', 'ｷｬｰ', 'ｽｺﾞｰｲ', 'ｷｬｰ', 'ｽﾃｷｰ'];
    return function () {
      var cheer = cheers[Math.floor(Math.random() * cheers.length)];
      var el = document.createElement('div');
      el.textContent = '\\' + cheer + '/';
      el.classList.add('cheer');
      el.style.left = getRandPer() + '%';
      return el;
    };
  }

  function makeLikeFn() {
    return function () {
      var el = document.createElement('div');
      el.classList.add('like');
      el.style.top = getRandPer() + '%';
      el.style.left = getRandPer() + '%';
      return el;
    };
  }

  function makeKwskFn() {
    return function () {
      var el = document.createElement('div');
      el.classList.add('kwsk');
      return el;
    };
  }

  function showAndRemove(el) {
    document.body.appendChild(el);
    el.addEventListener("animationend", function callback(event) {
      document.body.removeChild(el);
      el.removeEventListener("animationend", callback);
    }, false);
  }

  function getRandPer() {
    return Math.floor(Math.random() * 95);
  }
})();