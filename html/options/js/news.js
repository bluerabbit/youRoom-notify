$(function () {
  var manifest = Manifest.load();
  $('.appname').text(manifest.name);

  var host = 'chrome-extension://' + location.host + '/html/options/';
  $("#config").attr("href", host + 'config.html');
  $("#news").attr("href", host + 'news.html');
  $("#about").attr("href", host + 'about.html');

  var message = [
    {date:'2014/02/11', msgs:['Chromeのバージョンアップにより動作しなくなっていた問題を修正しました。', 'ブックマーク機能を廃止しました。']},
    {date:'2012/02/18', msgs:['youRoom Notifyを作成しました。', 'http://goo.gl/hZ1zd']}
  ];

  message.forEach(function (e, i) {
    var ul = $('<ul />').attr('style', 'padding-left:20px;padding-bottom: 10px;');
    e.msgs.forEach(function (m) {
      ul.append($('<li />').css('padding-bottom', '10px').text(m));
    });
    $('#table-content').append($('<h3 />').text(e.date)).append(ul);
  });
});
