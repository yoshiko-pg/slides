const milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
const ds = milkcocoa.dataStore('slide/20150929');

const w = document.getElementById('w');
Bacon.fromEventTarget(w, 'click')
  .onValue(() => {
    ds.send({message: 'wwwwwww', ts: new Date().getTime()});
  });
