var BG = chrome.extension.getBackgroundPage();
var options = BG.options;
$(function () {
  var manifest = Manifest.load();
  $('.appname').text(manifest.name);

  var host = 'chrome-extension://' + location.host + '/html/options/';
  $("#news").attr("href", host + 'news.html');
  $("#about").attr("href", host + 'about.html');
  $('#consumer_key').val(options.consumer_key).change(save);
  $('#consumer_secret').val(options.consumer_secret).change(save);
  enabledAuthButton();
  $('#auth').click(function () {
    options.reset_oauth();
    save();
    chrome.extension.sendRequest({id:'auth'});
  });
});

function enabledAuthButton() {
  if (BG.youroom) {
    $('#auth').attr('disabled', true);
    $('#consumer_key').attr('disabled', true);
    $('#consumer_secret').attr('disabled', true);
  } else if ($('#consumer_key').val().length == 0 || $('#consumer_secret').val().length == 0) {
    $('#auth').attr('disabled', true);
  } else {
    $('#auth').attr('disabled', false);
  }
};

function save() {
  enabledAuthButton();
  options.consumer_key = $('#consumer_key').val();
  options.consumer_secret = $('#consumer_secret').val();
  options.save();
  setTimeout(function () {
    BG.timer.restart();
  }, 5000);
};