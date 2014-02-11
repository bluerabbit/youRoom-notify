$(function () {
  var manifest = Manifest.load();
  $('.appname').text(manifest.name);
  $('#ver').text(manifest.version);
  var host = 'chrome-extension://' + location.host + '/html/options/';
  $("#config").attr("href", host + 'config.html');
  $("#news").attr("href", host + 'news.html');
  $("#about").attr("href", host + 'about.html');
});
