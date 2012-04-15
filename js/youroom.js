var YouRoom = function (consumer_key, consumer_secret) {
    this.oauth = ChromeExOAuth.initBackgroundPage({
        'request_url':'https://www.youroom.in/oauth/request_token',
        'authorize_url':'https://www.youroom.in/oauth/authorize',
        'access_url':'https://www.youroom.in/oauth/access_token',
        'consumer_key':consumer_key,
        'consumer_secret':consumer_secret,
        'app_name':'youRoom Notify'
    });
};

YouRoom.prototype = {
    authorize:function (callback) {
        assert && assert(callback != null);
        this.oauth.authorize(callback);
    },
    first:function (callback) {
        assert && assert(callback != null);
        this.request({}, function (data) {
            callback(data[0].entry);
        });
    },
    all:function (callback) {
        assert && assert(callback != null);
        this.request({}, function (data) {
            callback(data);
        });
    },
    find_by_since:function (date, callback) {
        assert && assert(callback != null);
        this.request({since:date}, function (data) {
            var result = [];
            data.forEach(function (object) {
                var entry = object.entry;
                if (new Date(entry.created_at) >= date) {
                    result.push({entry:entry});
                }
            });
            callback(result);
        });
    },
    request:function (params, callback) {
        assert && assert(callback != null);
        var url = 'https://www.youroom.in/';
        params.format = params.format || 'json';
        params.flat = params.flat || 'true';
        console.log(params);
        this.oauth.sendSignedRequest(url, function (resp, xhr) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            callback(data);
            return null;
        }, { 'method':'GET', 'parameters':params });
    },
    find_by_id:function (group_id, id, callback) {
        assert && assert(callback != null);
        var url = "https://www.youroom.in/r/" + group_id + "/entries/" + id;
        this.oauth.sendSignedRequest(url, function (resp, xhr) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            callback(data);
            return null;
        }, { 'method':'GET', 'parameters':{'format':'json'} });
    },
    find_my:function (callback) {
        assert && assert(callback != null);
        var url = 'https://www.youroom.in/groups/my';
        var request = { 'method':'GET', 'parameters':{'format':'json'} };
        this.oauth.sendSignedRequest(url, function (resp, xhr) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            callback(data);
            return null;
        }, request);
    },
    post:function (group_id, target_id, content, callback) {
        var url = 'https://www.youroom.in/r/' + group_id + "/entries";
        var params = {format:'json', 'entry[content]':content, 'entry[parent_id]':target_id};
        this.oauth.sendSignedRequest(url, function (resp, xhr) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            callback(data);
            return null;
        }, { 'method':'POST', 'parameters':params, 'headers':{ 'Content-Type':'application/xml'} });
    },
    delete:function (group_id, target_id, callback) {
        var url = 'https://www.youroom.in/r/' + group_id + "/entries/" + target_id;
        this.oauth.sendSignedRequest(url, function (resp, xhr) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            callback(data);
            return null;
        }, { 'method':'DELETE', 'parameters':{'format':'json'}, 'headers':{ 'Content-Type':'application/xml'} });
    }

};

YouRoom.roomName = function (entry) {
    return entry.participation.group.name;
};
YouRoom.roomId = function (entry) {
    return entry.participation.group.to_param;
};
YouRoom.userName = function (entry) {
    return entry.participation.name;
};
YouRoom.url = function (entry) {
    return "https://www.youroom.in/r/" + YouRoom.roomId(entry) + "/entries/" + entry.root_id;
};
YouRoom.id = function (entry) {
    return entry.root_id;
};

//entry: Object
//	can_update: boolean
//	content: string
//	created_at: date string
//	descendants_count: integer
//	has_read: boolean
//	id: integer
//	level: integer
//	parent_id: integer
//	participation: Object
//		group: Object
//			id: integer
//			name: string
//			to_param: string  <- room_id
//			categories: Array
//				name: string
//	root_id: integer
//	unread_comment_ids: string
//	updated_at: date string

// entry.participation.name
// + "@"
// + entry.participation.group.name
// + "(" + dateFormat(entry.updated_at) + ")"
// + entry.content