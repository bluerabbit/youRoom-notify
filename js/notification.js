var Notification = function() {
  this._notifies    = {};
  this._windowCount = 0;
};

Notification.prototype = {
  open: function (item) {
    var id = this._windowCount++ + "";

    chrome.notifications.create(id, {
      title:   item.title,
      iconUrl: '/images/notification_icon.png',
      type:    'basic',
      message: item.body
    }, function (){});

    this._notifies[id] = {'id': id, 'item': item};
    return id;
  },
  close: function (id) {
    var notifies = this._notifies;
    if (id != null) {
      chrome.notifications.clear(id, function (){});
    } else {
      Object.keys(notifies).forEach(function(id){
        chrome.notifications.clear(id, function (){});
      });
    }
  },
  getItem: function (id) {
    var notify = this._notifies[id];
    if (notify && notify.item) {
      return notify.item;
    }
    return null;
  }
};
