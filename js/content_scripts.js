function getBookmark(callback) {
    chrome.extension.sendRequest({id:'getBookmark'}, function (bookmarkList) {
        callback(bookmarkList);
    });
}
function bookmark(isAdd, group_id, id, callback) {
    chrome.extension.sendRequest({id:'bookmark', isAdd:isAdd, group_id:group_id, entry_id:id}, function () {
        callback();
    });
}

function setStar() {
    // $('.topic_top_action').find('.btn-message')
    // $('.entry-img').remove();
    // TODO:要リファクタリング
    getBookmark(function (bookmarkList) {
        $('.entry-time a').each(function (i, e) {
            var ul = $(e).parent().parent();
            var hash = urlToRoomIdEntryId($(e).attr('href'));
            if (have(bookmarkList, $(e).attr('href'))) {
                var img = starOnImg();
                var imgClick = function () {
                    var flg = $(this).data('on');
                    var xx = flg ? starOffImg() : starOnImg();
                    xx.click(imgClick);
                    $(this).replaceWith(xx);
                    bookmark(!flg, hash.group_id, hash.id, function () {
                    });
                }
                img.click(imgClick);
                var li = $('<li />').append(img);
                ul.append(li);
            } else {
                var img = starOffImg();
                var imgClick = function () {
                    var flg = $(this).data('on');
                    var xx = flg ? starOffImg() : starOnImg();
                    xx.click(imgClick);
                    $(this).replaceWith(xx);
                    bookmark(!flg, hash.group_id, hash.id, function () {
                    });
                }
                img.click(imgClick);
                var li = $('<li />').append(img);
                ul.append(li);
            }
        });
    });
    //$('.topic_top_action').append($('<img src="https://www.youroom.in/r/15458/participations/61352/picture?1325983783" />'));
}

setStar();

function urlToRoomIdEntryId(url) {
    if (url.split('/').length == 7) {
        return {group_id:url.split('/')[4], id:url.split('/')[6]};
    }
    return null;
}

function starOnImg() {
    return $('<img>').attr('src', chrome.extension.getURL('/images/star_on.png')).css('cursor', 'pointer').data('on', true);
}

function starOffImg() {
    return $('<img>').attr('src', chrome.extension.getURL('/images/star_off.png')).css('cursor', 'pointer').data('on', false);
}

function have(bookmarkList, url) {
    var result = false;
    bookmarkList.forEach(function (e, i) {
        if (e.url == url) {
            result = true;
        }
    });
    return result;
}