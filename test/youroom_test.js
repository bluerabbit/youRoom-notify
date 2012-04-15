module('YouRoom.js', {
	setup: function() {
        var consumer_key = "";
        var consumer_secret = "";
        this.youroom = new YouRoom(consumer_key, consumer_secret);
	},
	teardown: function() {
	}
});

test('authorize', function() {
	this.youroom.authorize(function () {
        ok(true);
    });
});

test('first', function() {
	this.youroom.first(function (entry) {
        console.log(entry)
        ok(entry.content.length > 0);
    });
});

