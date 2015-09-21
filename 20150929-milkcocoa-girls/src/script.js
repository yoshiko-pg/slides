const milkcocoa = new MilkCocoa("woodieto7do3.mlkcca.com");
const ds = milkcocoa.dataStore('slide/20150929');

Bacon.fromBinder((callback) => {
  ds.on('send', callback);
  () => ds.off('send');
})
  .onValue((value) => {
    console.log(value.path, value.value);
  });
