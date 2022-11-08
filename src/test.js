var FANQIE_TIME = 25;
function beep() {
  for (var i = 0; i < 20; i++) {
    process.stdout.write("\x07");
  }
}
var startTime = new Date();
var needTime = startTime.setMinutes(startTime.getMinutes() + FANQIE_TIME);
function showTime() {
  var now = new Date();
  var totalSecond = Math.floor((needTime - now) / 1000);
  if (totalSecond <= 0) {
    beep();
    if (interVal) {
      clearInterval(interVal);
    }
    return;
  }
  var mm = Math.floor(totalSecond / 60);
  var ss = Math.floor(totalSecond % 60);

  console.log(mm + ":" + ss);
}
var interVal = setInterval(showTime, 1000);
