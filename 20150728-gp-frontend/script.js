function drawDemo() {
  'use strict';
  var canvas = document.getElementById('cv');
  var context = canvas.getContext('2d');
  context.lineCap = 'round';
  var widthInput = document.getElementsByName('width')[0];
  Bacon.fromEventTarget(widthInput, 'input').map('.target.value').onValue(function (width) {
      context.lineWidth = width;
  });
  var colorPalette = document.getElementsByClassName('width-slider')[0];
  Bacon.fromEventTarget(colorPalette, 'click').map(function () {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }).onValue(function (color) {
      context.strokeStyle = color;
      colorPalette.style.color = color;
  });
  Bacon.fromEventTarget(canvas, 'click').bufferWithTime(500, 2).filter(function (_ref) {
      var length = _ref.length;
      return length == 2;
  }).onValue(function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
  });
  var mouseDowns = Bacon.fromEventTarget(canvas, 'mousedown').doAction('.preventDefault').doAction(function () {
      return context.beginPath();
  });
  var mouseUps = Bacon.fromEventTarget(canvas, 'mouseup').doAction('.preventDefault').doAction(function () {
      return context.closePath();
  });
  var isPainting = mouseDowns.awaiting(mouseUps);
  Bacon.fromEventTarget(canvas, 'mousemove').filter(isPainting).onValue(function (e) {
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();
  });
}
