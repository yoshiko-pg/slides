(function() {
  'use strict';

  const milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
  const ds = milkcocoa.dataStore('slide/20150929');
  let currentPage;

  // スマートフォン側の表示変更
  talkie.changed
    .onValue(() => ds.send({to: 'sp', mode: 'reactions'}));
  talkie.changed
    .filter((current) => current.hasAttribute('end'))
    .log()
    .onValue((current) => ds.send({to: 'sp', mode: 'end'}));
  talkie.changed
    .filter((current) => current.hasAttribute('vote'))
    .onValue((current) => {
      let items = [];
      let itemElems = current.getElementsByTagName('LI');
      for(let i=0;i<itemElems.length;i++) {
        items.push(itemElems[i].innerText);
      }
      ds.send({to: 'sp', mode: 'vote', items: items});
      currentPage = current;
    });

  // スマートフォンからのデータの受信
  let stream = Bacon.fromBinder((callback) => {
      ds.on('send', callback);
      () => ds.off('send');
    })
    .filter((data) => data.value.to == 'pc');

  // スライド上にリアクション表示
  stream
    .map((data) => {
      switch(data.value.type) {
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
    })
    .onValue((fn) => {
      let el = fn();
      showAndRemove(el);
    });

  // 投票
  stream
    .filter((data) => data.value.vote)
    .onValue((data) => {
      let stamped = document.getElementById(data.value.id);
      if (stamped) {
        stamped.parentNode.setAttribute('count', stamped.parentNode.getAttribute('count') - 1);
        stamped.parentNode.removeChild(stamped);
      }

      let items = currentPage.getElementsByTagName('LI');
      for(let i=0;i<items.length;i++) {
        if (items[i].innerText == data.value.vote) {
          let stamp = document.createElement('span');
          stamp.classList.add('stamp');
          stamp.setAttribute('id', data.value.id);
          items[i].appendChild(stamp);
          let stampCount = items[i].querySelectorAll('.stamp').length;
          items[i].setAttribute('count', stampCount);
        }
      }
    });

  function makeMarqueeFn(text) {
    return () => {
      let el = document.createElement('div');
      el.textContent = text;
      el.classList.add('marquee');
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

  function makeKwskFn() {
    return () => {
      let el = document.createElement('div');
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
}());
