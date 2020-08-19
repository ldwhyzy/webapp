const marked = require('marked');

function markdownToHTML(str){
    return marked(str);
}

function getPublishTime(UTCtime, digital=false){
    try{
        UTCtime = parseInt(UTCtime);
        if(Number.isNaN(UTCtime))return '未知时空';
    }catch(e){
        return '未知时空';
    };
    if(digital){
        return new Date(UTCtime).toLocaleString('chinese',{hour12:false});
    }
    var currentTime = new Date();
    var published = currentTime.getTime() - UTCtime;
    var publishTime = '';
    if(published < 1000)publishTime = '刚刚';
    else if(published < 1000*60)publishTime = '' + Math.floor(published/1000) + '秒前';
    else if(published < 1000*60*60)publishTime = '' + Math.floor(published/(1000*60)) + '分前';
    else if(published < 1000*60*60*24)publishTime = '' + Math.floor(published/(1000*60*60)) + '小时前';
    else {
        var date = new Date(UTCtime);
        publishTime = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
    }
    return publishTime;
}

function ctxurlparse(querystr){
    //sample /blog/blogs/theme/4?keyword=人工智能
    //var keywordstr = urlstr.split('?')[1];
    var keywordarr = decodeURIComponent(querystr).split('&');
    var keyword = {};
    for(var i=0;i<keywordarr.length;i++){
        var str = keywordarr[i].split('=');
        //keyword[str[0]] = decodeURIComponent(str[1]);
        keyword[str[0]] = str[1];
    }
    return keyword;
}

module.exports = {
    getPublishTime,
    ctxurlparse,
    markdownToHTML
  };