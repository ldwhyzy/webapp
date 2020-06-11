const WebSocket = require('ws')

function parseUser(token){
    var user = {};
    if(typeof token!=="string")return user;
    var arr = decodeURIComponent(token).split(";").reduce(function(acc, cur){
        let a = cur.split("=");
        acc[a[0]]=a[1];
        return acc;
    }, {});
    if(arr['aid']==='test33'){
        user.id = arr['id'];
        user.name = arr['name'];
    }
    console.log(JSON.stringify(arr));
    return user;
}

var messageIndex = 0;
var usersocketmap = {};

function createMessage(type, user, sendto, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        sendto: sendto,
        data: data
    });
}

function onConnect() {
    let user = this.user;
    let msg = createMessage('join', user, null, `${user.name} joined.`);
    this.wss.broadcast(msg);
    // build user list:
    //wss.clients is Set type, map caller should be Array.
    let users = Array.from(this.wss.clients).map(function(client){
        return client.user;
    });
    this.send(createMessage('list', user, null, users));
}

function onMessage(message) {
    let user = this.user;
    console.log(`[WebSocket] message from ${user.name}: ${message}`);
    if (message && message.trim()) {
        try{
            message = JSON.parse(message);
            let recievews = message.sendto&&usersocketmap[message.sendto];
            let sendto = recievews&&recievews.user;
            if(message.type==="publicchat"){
                console.log("[SSS]public chat");
                let msg = createMessage('publicchat', this.user, sendto, message.data);
                this.wss.broadcast(msg);
            }else if(message.type==="privatechat"){
                console.log("[SSS]private chat");
                let msg = createMessage('privatechat', this.user, sendto, message.data);
                //this.wss.broadcast(msg);
                if(recievews &&recievews.readyState === WebSocket.OPEN)
                recievews.send(msg);
                if(user.id!==sendto.id)this.send(msg);
            }
        }catch(e){
           console.log(`[WebSocket] message from ${user.name} error found `, e);
        }    
    }
}

function onClose() {
    let user = this.user;
    let msg = createMessage('left', user, null, `${user.name} is left.`);
    this.wss.broadcast(msg);
    console.log(`[WebSocket] ${user.name} is left.`);
}

function onError(err){
    console.log('[WebSocket] error: '+err);
}

function createWebSocketServer(server=null){
    if(server)var wss = new WebSocket.Server({server});
    else var wss = new WebSocket.Server({port:3001});
    wss.broadcast = function broadcast(data) {  //wss.clients is a set of websocket!!! 
        wss.clients.forEach(function each(client) {
            if(client.readyState === WebSocket.OPEN)
                client.send(data);
        });
    };    

    // JSON.safeStringify = (obj, indent = 2) => {  //
    //     let cache = [];
    //     const retVal = JSON.stringify(
    //       obj,
    //       (key, value) =>
    //         typeof value === "object" && value !== null
    //           ? cache.includes(value)
    //             ? undefined // Duplicate reference found, discard key
    //             : cache.push(value) && value // Store value in our collection
    //           : value,
    //       indent
    //     );
    //     cache = null;
    //     return retVal;
    //   };
    
    wss.on('connection', function (ws, req) {
        const ip = req.socket.remoteAddress;
        //console.log(ip);
        //var cache = [];
        /*
        var str = JSON.stringify(req, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // 移除
                    return;
                }
                // 收集所有的值
                cache.push(value);
            }
            return value;
        });  
        console.log('req str: '+str);  
        */
        //console.log('req keys:'+ Object.keys(req));
        //console.log('req cache: '+JSON.stringify(req.headers));
        if((!/^\/ws\/chat\/\?token=.+$/.test(req.url))){
          ws.close(4000, 'Invalid url');
          return;
        }
        
        var user = parseUser(req.url.split('?token=')[1]);
        if(!user.id){
          ws.close(4001, 'Invalid user');
          return;
        }     
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        ws.user = user;
        ws.wss = wss;
        usersocketmap[user.id] = ws;
        //usersocketmap['user'] = user;
        onConnect.apply(ws);
    });
    
    console.log('[SERVER] ON WORK');
    //return wss;    
}

//createWebSocketServer();
module.exports = createWebSocketServer;
