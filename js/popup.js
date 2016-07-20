var popup = {
    multiline: function(fn){
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n';
    },
    shop_code: function(shop){
        return popup.multiline(function(){/*!@preserve
            <div class="shop-info">
                <ul>
                    <li><label>商店名称 :</label>  <span>{name}</span></li>
                    <li><label>商店链接 :</label>  <span>{link}</span></li>
                </ul>
                <hr>
            </div>
        */}).format(shop);
    },
    pro_code: function(pro){
        return popup.multiline(function(){/*!@preserve
            <div class="pro-info">
                <ul>
                    <li><label>商品名称 :</label>  <span>{title}</span></li>
                    <li><label>商品原价 :</label>  <span style="color:red">{op}</span></li>
                    <li><label>商品现价 :</label>  <span style="color:red">{np}</span></li>
                    <li><label>商品尺码 :</label>  <span style="color:blue">{sz}</span></li>
                    <li><label>商品颜色 :</label>  <span style="color:blue">{color}</span></li>
                    <li><label>商品描述 :</label>  <span>{desc}</span></li>
                </u>
                <hr>
            </div>
        */}).format(pro);
    },
    gen: function(data){
        if (data.loaded === false){
            $('#popup').html(data.error);
        }else{
            $('#upload').css('display', 'block');
            var shop = popup.shop_code(data.shop);
            var pro = popup.pro_code(data);
            $('#popup').html([shop, pro].join(''));
            var imgs = ['<div class="pro-img">'];
            for(var i in data.imgs){
                var obj = data.imgs[i];
                imgs.push('<img src="'+obj+'">');
            }
            imgs.push('</div>');
            $('#popup').append(imgs.join(''));
        }
    },
    load: function(){
        $('#popup').html('正在加载中...');
        String.prototype.replaceAll = function (exp, newStr) {
            return this.replace(new RegExp(exp, "gm"), newStr);
        };
        String.prototype.format = function(args) {
            var result = this;
            if (arguments.length < 1) return result;        
            var data = arguments; // 如果模板参数是数组
            if (arguments.length == 1 && typeof (args) == "object") data = args;
            for ( var key in data) {
                var value = data[key];
                if (undefined != value) result = result.replaceAll("\\{" + key + "\\}", value);
            }
            return result;
        };
        $('#upload').click(function(){
            if (popup.data.laoded === false){
                alert('数据未准备好');
                return;
            }
            $.ajax({
                type:'post',
                url :'http://pack.naonaome.com/query/update_pangolin_spider',
                data:{'pro':JSON.stringify(popup.data)},
                success: function(datas, status){
                    if(datas.code == 0){
                        $('#popup').html('上传成功!');
                    }else{
                        alert(datas.msg);
                    }
                },
                error: function(status) {
                    alert("无法连接网络，请check网络连接和服务器");
                    return false;
                }
            });
        });
        chrome.runtime.sendMessage('pangolin-background-load');
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
            console.log(message);
            popup.gen(message);
        })
    }
};
popup.load();