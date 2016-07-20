chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message != 'pangolin-background-load') return;
    var pro = {loaded:false};
    chrome.tabs.getSelected(function(tab){
        var raw = tab.url.split('://')[1].split('.')[1].toLowerCase();
        pro.spider = raw;
        pro.url = tab.url;
        $.ajax({
            type:"get",
            url:"http://pack.naonaome.com/static/spider/"+raw+".js",
            async:false,
            dataType: 'text',
            success: function(script){
                chrome.tabs.sendMessage(tab.id, {spider: script}, function(response){
                    pro.loaded = true;
                    pro = $.extend({}, pro, response);
                    console.log(pro);
                    chrome.runtime.sendMessage(pro);
                })
            },
            error: function(status){
                pro.error = '<b style="color:red; font-size:20px">获取脚本'+raw+'.js失败！</b><br> status:'+JSON.stringify(status);
                console.log(pro);
                chrome.runtime.sendMessage(pro);
            }
        });
    })
});