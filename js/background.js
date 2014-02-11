function unit_test() {
  if (assert && assert.DEBUG) {
    window.open('chrome-extension://' + location.host + '/test/index.html');
  }
}

var options      = Options.load();
var notification = new Notification('images/icon.png', 1000 * options.autoCloseTimeSS);
var timer        = new Timer(1000 * 60 * options.timerMI); // n分に一回

if (localStorage['oauth_tokenundefined'] != null) {
  var youroom = new YouRoom(options.consumer_key, options.consumer_secret);
  youroom.find_my(function (groupList) {
    options.myGroupList = [];
    groupList.forEach(function (e, i) {
      options.myGroupList.push({id:e.group.id, name:e.group.name});
    });
  });
}

chrome.browserAction.onClicked.addListener(function () {
  window.open('/html/options/config.html');
});

function main(options) {
  extensionUpdateNotify(options);

  timer.start(function () {
    console.log("timer run");
    console.log(options);
    setBadgeText(options);
    if (youroom) {
      notify(youroom, options);
    }
  });
}
main(options);

function setBadgeText(options) {
  if (options.bookmarkList.length == 0) {
    chrome.browserAction.setBadgeText({text:''});
  } else {
    chrome.browserAction.setBadgeText({text:'' + options.bookmarkList.length});
  }
}

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
                         title: YouRoom.roomName(entry) + '@' + YouRoom.userName(entry) + dateFormat(entry.updated_at),
                         body:  entry.content});
    });
    options.lastRequestDate = new Date();
    options.save();
  });
}
function dateFormat(dateString) {
  var date = new Date(dateString);
  var mm = date.getMonth() + 1;
  var dd = date.getDate();
  var hh = date.getHours();
  var mi = date.getMinutes();
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mi < 10) {
    mi = "0" + mi;
  }
  return mm + "/" + dd + " " + hh + ":" + mi;
}

chrome.extension.onRequest.addListener(function (message, sender, sendResponse) {
  console.debug(message);
  if (message.id == 'auth') {
    console.log(options);
    youroom = new YouRoom(options.consumer_key, options.consumer_secret);
    youroom.authorize(function () {
      console.log("authorize!!authorize!!");
      youroom.isAuth = true;
    });
  } else if (message.id == 'window.open') {
    window.open(message.url, message.target);
    sendResponse();
  } else if (message.id == 'bookmark') {
    if (message.isAdd) {
      youroom.find_by_id(message.group_id, message.entry_id, function (object) {
        var entry = object.entry;
        var item = {url:YouRoom.url(entry), title:YouRoom.roomName(entry) + '@' + YouRoom.userName(entry), date:dateFormat(entry.updated_at), msg:entry.content, id:YouRoom.id(entry), group_id:YouRoom.roomId(entry)};
        options.bookmarkList.push(item);
        options.save();
        setBadgeText(options);
      });
    } else {
      var result = [];
      options.bookmarkList.forEach(function (e, i) {
        if (e.id != message.entry_id) {
          result.push(e);
        }
      });
      options.bookmarkList = result;
      options.save();
      setBadgeText(options);
    }
    sendResponse();
  } else if (message.id == 'getBookmark') {
    sendResponse(options.bookmarkList);
  } else {
    sendResponse(notification.getItem(message.id));
  }
});

