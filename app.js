//'use strict';
const http = require('http');
const Koa = require('koa');
// const bodyParser = require('koa-bodyparser'); //解析formdata数据无力
const koaBody = require('koa-body');  
const controller = require('./controller');
const templating = require('./templating');
const restPre = require('./rest');
const cookieSet = require('./cookieset');
const createWebSocketServer = require('./websocket');
const websocketOn = require('./config').WEBSOCKET_ON;

const isProduction = process.env.NODE_ENV === 'production';

const app = new Koa();

if(!isProduction){  // 客户端请求的文件路径为以/static/开头，则直接在/static/下查找并返回。/static/下为样式表CSS文件和组件效果的JS文件。
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));    //__dirname，被执行js文件(即app.js)的绝对路径。
}

templating('views', {   
    // noCache: !isProduction,
     noCache: true,
    // watch: !isProduction
     watch: true
}, app);

//EL表达式语言，反引号才能${ctx.request.method}求值，单双引号不求值。
//app.use((ctx,next){});会在next函数语句next();跳到下一个的app.use()并执行到next();语句之前，然后跳到下一个app.use()；
//最后一个app.use()；执行完反向向上执行next();语句之后的语句。
app.use(async (ctx, next) => {  //从接收请求到反馈的时间
    console.log(`${ctx.request.method} ${ctx.request.url}`);  
    console.log(`request.path ${ctx.request.path}`);
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log(`X-response-Time: ${ms}ms`);
});

app.use(async (ctx, next) => {  //404
    await next();
    if(parseInt(ctx.status)===404){
        if(ctx.request.url.startsWith("/api"))
            ctx.rest({info:"404 error"});
        else 
        ctx.response.redirect('/404');
    }
});

//解析POST数据，可在ctx.request.body获取
//app.use(bodyParser());  
app.use(koaBody({ multipart: true, formidable:{maxFileSize: 2*1024*1024} }));

app.use(cookieSet.cookieCheck());  //检查是否有cookie

app.use(restPre.restify(app));

app.use(controller());

app.on('error', err=>{
    console.log('**********************ERROR*********************')
    console.log(err);
    console.log('********************ERROR END*******************')
});


const server = http.createServer(app.callback());
app.context.httpServer = server;
if(websocketOn){
    const wss = createWebSocketServer(server);
    app.context.wss = wss;
}


// server.on('upgrade', function(req, socket, head){
//     console.log(req.url);  
//     console.log(Object.keys(head));
//     wss.handleUpgrade(req, socket, head, function (ws) {
//         wss.emit('connection', ws, req);
//     });        
// });

server.listen(3000);

console.log('app started at port 3000...');
