var log = function(msg){
    if (typeof msg == 'object') msg = JSON.stringify(msg);
    console && console.log('pangolin msg : ' + msg);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
    log('get msg from background : '+sender.id);
    var req = eval(request.spider);
    eval(req);
    var pro = spider.pro_msg();
    sendResponse(pro);
});
