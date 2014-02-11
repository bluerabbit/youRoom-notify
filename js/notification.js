var Notification = function(imagePath, autoCloseTime) {
	this._url           = 'chrome-extension://' + location.host + '/' + imagePath;
	this._notifies      = {};
	this._autoCloseTime = autoCloseTime || 0;
	this._windowCount   = 0;
};

Notification.prototype = {
	open: function (item) {
		var id            = this._windowCount++;
		var autoCloseTime = this._autoCloseTime;

		var notify = webkitNotifications.createNotification(this._url, item.title, item.body);
		notify.ondisplay = function(){
			if (autoCloseTime > 0){
				setTimeout(function(){
					notify.close();
				}, autoCloseTime);
			}
		};

    notify.onclick = function() {
      this.cancel();
      chrome.tabs.create({ url: item.url, selected: true });
    };

		var self = this;
		notify.onclose = function(){
			delete self._notifies[id];
		};

		notify.show();
		self._notifies[id] = {'notify':notify, 'item':item};
		return id;
	},
	close: function (id) {
		var notifies = this._notifies;
		if (id != null) {
			var note = notifies[id];
			note.notify.close();
		} else {
			Object.keys(notifies).forEach(function(id){
				var note = notifies[id];
				note.notify.close();
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
