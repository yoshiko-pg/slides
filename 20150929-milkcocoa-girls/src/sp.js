const milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
const ds = milkcocoa.dataStore('slide/20150929');
const id = makeId();

let voteOptions = document.querySelector('.vote ul');

// リアクション送信
let buttons = [...document.querySelectorAll('.reaction-btn')];
Bacon.fromArray(buttons)
  .flatMap((e) => Bacon.fromEventTarget(e, 'click'))
  .map((e) => e.target.value)
  .onValue((value) => ds.send({to: 'pc', type: value}));


// 投票送信
Bacon.fromBinder((callback) => {
    window.vote = callback;
    () => window.vote = null;
  })
  .onValue((value) => ds.send({to: 'pc', vote: value, id: id}));


// メッセージ送信
Bacon.fromBinder((callback) => {
    window.send = () => {callback(); return false;};
    () => window.send = null;
  })
  .onValue(() => {
    let commentEl = document.getElementById('comment');
    ds.send({to: 'pc', message: commentEl.value});
    commentEl.value = '';
  });


// モード変更
let stream = Bacon.fromBinder((callback) => {
    ds.on('send', callback);
    () => ds.off('send');
  })
  .filter((data) => data.value.to == 'sp');

stream
  .map((data) => data.value.mode)
  .onValue((mode) => {
    document.getElementsByClassName('showing')[0].classList.remove('showing');
    document.getElementsByClassName(mode)[0].classList.add('showing');
  });

stream
  .filter((data) => data.value.mode == 'vote' && data.value.items)
  .map((data) => data.value.items)
  .onValue((items) => {
    voteOptions.innerHTML = '';
    items.forEach((item, index) => {
      let li = document.createElement('li');
      let radio = document.createElement('input');
      let label = document.createElement('label');
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


function makeId(){
  let randam = Math.floor(Math.random()*1000);
  let date = new Date();
  let time = date.getTime();
  return randam + time.toString();
}
