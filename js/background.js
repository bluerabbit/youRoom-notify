var options      = Options.load();
var notification = new Notification('images/notification_icon.png', 1000 * options.autoCloseTimeSS);
var timer        = new Timer(1000 * 60 * options.timerMI); // n分に一回

if (localStorage['oauth_tokenundefined'] != null) {
  var youroom = new YouRoom(options.consumer_key, options.consumer_secret);
}

chrome.browserAction.onClicked.addListener(function () {
  if (youroom) {
    window.open('https://www.youroom.in/');
  } else {
    window.open('/html/options/config.html');
  }
});

function main(options) {
  extensionUpdateNotify(options);

  timer.start(function () {
    if (youroom) {
      notify(youroom, options);
    }
  });
}

main(options);

function extensionUpdateNotify(options) {
  var manifest = Manifest.load();
  if (options.appVersion == "0.0.0.0") {
    // 初期インストール
    options.appVersion = manifest.version;
    options.save();
  } else if (options.appVersion != manifest.version) {
    // アップデート
    if (options.appVersion.substring(0, options.appVersion.lastIndexOf(".")) != manifest.version.substring(0, manifest.version.lastIndexOf("."))) {
      // 末尾のバージョンNoを除いた値が更新されていたら通知(末尾のバージョンNoだけが変わっている場合は通知しない)
      notification.open({url: '/html/options/news.html', title: '[youRoom Notify Update]', body: manifest.version + "に更新されました。"});
    }
    options.appVersion = manifest.version;
    options.save();
  }
}

function notify(youroom, options) {
  youroom.find_by_since(options.lastRequestDate, function (data) {
    data.forEach(function (object) {
      var entry = object.entry;
      notification.open({url:   YouRoom.url(entry),
                         title: "[" + YouRoom.roomName(entry) + "]" + ' @' + YouRoom.userName(entry) + ' ' + moment(entry.updated_at).format('MM/DD HH:mm'),
                         body:  entry.content});
    });
    options.lastRequestDate = new Date();
    options.save();
  });
}

chrome.extension.onRequest.addListener(function (message, sender, sendResponse) {
  if (message.id == 'auth') {
    youroom = new YouRoom(options.consumer_key, options.consumer_secret);
    youroom.authorize(function () {
      youroom.isAuth = true;
    });
  }
});

