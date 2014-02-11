// テキストボックスをコメントし易いように動的にテキストボックスの高さが変わるようにする
$('.entry_content').live('focus', function () {
    var self = $(this);
    if (!self.data("has-scroll")) {
        self.data("has-scroll", true);
        self.scroll(function () {
            self.css('height', (parseInt(self.css('height').slice(0,-2)) + 10) + 'px');
        });
    }
});