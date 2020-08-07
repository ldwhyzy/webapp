const WebSocket = require('ws')
const jwt = require('jsonwebtoken');
const secret = require('./config').TOKEN_SECRET;
const Message = require('./models/Message');

var messageIndex = 0;
var usersocketmap = {};

function parseUser(token){
    var user = {};
    if(!token||typeof token!=="string")return user;
    // var arr = decodeURIComponent(token).split(";").reduce(function(acc, cur){
    //     let a = cur.split("=");
    //     acc[a[0]]=a[1];
    //     return acc;
    // }, {});
    // if(arr['aid']==='test33'){
    //     user.id = arr['id'];
    //     user.name = arr['name'];
    // }
    try{
        var decodeToken = jwt.verify(decodeURIComponent(token), secret);
        user = {id: decodeToken.id, name: decodeToken.name};
    }catch(err){
        console.log('[parseUser] jwt decode error!');
    }
    console.log(JSON.stringify(decodeToken));
    if(user)user.icon = 'yuri_PR.png';
    return user;
}

async function chatArrayCheck(storeAll=false){
    if(!storeAll&&this.chatArray.length>=200){
        //chat save database;
        let result = await Message.createMessages(this.chatArray.slice(0, 100));
        if(result.success)this.chatArray.splice(0, 100);
    }else if(storeAll){
        let result = await Message.createMessages(this.chatArray);
    }
}

function createMessage(type, user, sendto, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        userid: user,
        sendto: sendto,
        data: data,
        sendtime: Date.now()
    });
}

function onConnect() {
    let user = this.user;
    let msg = createMessage('mainMessage', user.id, null, this.wss.chatArray);
    this.send(msg);
    msg = createMessage('join', user.id, null, `${user.name} joined.`);
    //this.wss.broadcast(msg);
    //this.wss.chatArray.push(msg);
    // build user list:
    //wss.clients is Set type, map caller should be Array.
    // let users = Array.from(this.wss.clients).map(function(client){
    //     return client.user;
    // });
    // this.send(createMessage('list', user, null, users));
    this.wss.broadcast(createMessage('list', user.id, null, this.wss.userList));
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
                let msg = createMessage('publicchat', this.user.id, sendto&&sendto.id, message.data);
                this.wss.broadcast(msg);
            }else if(message.type==="privatechat"){
                console.log("[SSS]private chat");
                let msg = createMessage('privatechat', this.user.id, sendto&&sendto.id, message.data);
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
    let msg = createMessage('left', user.id, null, `${user.name} is left.`);
    this.wss.broadcast(msg);
    console.log(`[WebSocket] ${user.name} is left.`);
}

function onError(err){
    console.log('[WebSocket] error: '+err);
}

function createWebSocketServer(server=null){
    if(server)var wss = new WebSocket.Server({server});
    else var wss = new WebSocket.Server({port:3001});
    wss.userList = {};
    wss.chatArray = [];
    wss.chatroomTheme = '自由发挥的主题会';

    let intervalObj = setInterval(async () => {
        await chatArrayCheck.call(wss);
    }, 1000*60*5);
    wss.intervalObj = intervalObj;
    //clearInterval(wss.intervalObj); //when close socket server, do this too.

    wss.broadcast = function broadcast(data) {  //wss.clients is a set of websocket!!! 
        wss.clients.forEach(function each(client) {
            if(client.readyState === WebSocket.OPEN)
                client.send(data);
        });
    };
    wss.closeServer = async function (){
        clearInterval(this.intervalObj); 
        await chatArrayCheck.call(this, true); 
        //this.close(1000, 'administrator close the server');
        this.close();
    }
    
    wss.getServerStatus = function(){
        return {onLineNum: this.clients.size, theme: this.chatroomTheme};
    }

    wss.setChatroomTheme = function(theme){
        if(theme)this.chatroomTheme = theme;
    }

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
        if(Object.keys(wss.userList).length>50){
            ws.close(5002, 'overabundance user');
            return;
        }
        wss.userList[user.id] = user;     
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
    return wss;    
}


//createWebSocketServer();
module.exports = createWebSocketServer;
