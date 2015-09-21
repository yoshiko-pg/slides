const milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
const ds = milkcocoa.dataStore('slide/20150929');

// buttons
let buttons = [...document.querySelectorAll('.reaction-btn')];
Bacon.fromArray(buttons)
  .flatMap((e) => Bacon.fromEventTarget(e, 'click'))
  .map((e) => e.target.value)
  .log()
  .onValue((value) => ds.send({message: value}));
