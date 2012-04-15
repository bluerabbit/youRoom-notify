var Options = function (values, storageKey) {
    this._storageKey = storageKey || 'options';
    values = values || {
        consumer_key:'',
        consumer_secret:'',
        timerMI:1, // 監視間隔(分)
        autoCloseTimeSS:30, // 通知ウィンドウを閉じるまでの時間(秒) 0の時は閉じない
        myGroupList:[], // 参加しているルーム
        bookmarkList:[], // [{id, date, groupName, name, content, url, parent_id, categories}]
        lastRequestDate:new Date(), // 最後にAPIコールした日時
        appVersion:'0.0.0.0'
    };

    // migration
    values.appVersion = values.appVersion || '0.0.0.0';
    values.lastRequestDate = new Date(values.lastRequestDate);
    values.bookmarkList = values.bookmarkList || [];
    values.myGroupList = values.myGroupList || [];
    values.schemaVersion = 3;

    var self = this;
    Object.keys(values).forEach(function (key) {
        self[key] = values[key];
    });
    this.save();
};
Options.prototype = {
    save:function () {
        localStorage[this._storageKey] =
            JSON.stringify(this, function (key, value) {
                if (key.indexOf('_') != 0) {
                    return value;
                }
            });
    },
    reset:function () {
        this.reset_oauth();
        localStorage.removeItem(this._storageKey);
    },
    reset_oauth:function () {
        localStorage.removeItem('oauth_tokenundefined');
        localStorage.removeItem('oauth_token_secretundefined');
    }
};

/**
 * @param {String} storageKey ストレージキー.
 * @return {Options} options.
 */
Options.load = function (storageKey) {
    storageKey = storageKey || 'options';
    if (localStorage.hasOwnProperty(storageKey)) {
        return new Options(JSON.parse(localStorage[storageKey]), storageKey);
    }
    return new Options(null, storageKey);
};
