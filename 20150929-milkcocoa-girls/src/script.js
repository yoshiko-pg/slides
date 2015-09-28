(function() {
  'use strict';

  const milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
  const ds = milkcocoa.dataStore('slide/20150929');

  Bacon.fromBinder((callback) => {
    ds.on('send', callback);
    () => ds.off('send');
  })
  .log()
  .map((data) => {
    switch(data.value.type) {
      case 'like':
        return makeLikeFn();
      //case 'kwsk':
      case 'cheer':
        return makeCheerFn();
      case 'www':
        return makeMarqueeFn(data.value.type);
      default:
        return makeMarqueeFn(data.value.message);
    }
  })
  .onValue((fn) => {
    let el = fn();
    showAndRemove(el);
  });

  function makeMarqueeFn(text) {
    return () => {
      let el = document.createElement('div');
      el.textContent = text;
      el.classList.add('liver');
      el.style.top = getRandPer() + '%';
      return el;
    };
  }

  function makeCheerFn() {
    let cheers = ['ｷｬｰ', 'ｶﾞﾝﾊﾞﾚｰ', 'ｷｬｰ', 'ｽｺﾞｰｲ', 'ｷｬｰ', 'ｽﾃｷｰ'];
    return () => {
      let cheer = cheers[Math.floor(Math.random() * cheers.length)];
      let el = document.createElement('div');
      el.textContent = '\\' + cheer + '/';
      el.classList.add('cheer');
      el.style.left = getRandPer() + '%';
      return el;
    };
  }

  function makeLikeFn() {
    return () => {
      let el = document.createElement('div');
      el.classList.add('like');
      el.style.top = getRandPer() + '%';
      el.style.left = getRandPer() + '%';
      return el;
    };
  }

  function showAndRemove(el) {
    document.body.appendChild(el);
    el.addEventListener("webkitTransitionEnd", function callback(event) {
      document.body.removeChild(el);
      el.removeEventListener("webkitTransitionEnd", callback);
    }, false);
    setTimeout(() => {
      el.classList.add('move');
    }, 100);
  }

  function getRandPer() {
    return Math.floor(Math.random() * 95);
  }
}());
