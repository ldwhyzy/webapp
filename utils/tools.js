function getIntervalTime(UTCtime){
    try{
        UTCtime = parseInt(UTCtime);
        if(Number.isNaN(UTCtime))return;
    }catch(e){
        return;
    };

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

module.exports = {
    getIntervalTime: getIntervalTime,
  };