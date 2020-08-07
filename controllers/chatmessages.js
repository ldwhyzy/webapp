const Blog = require('../models/Blog');
const Blogtheme = require('../models/Blogtheme');
const ADMIN_CODE = require('../config').ADMIN_CODE;
const xhrAuthenticateCheck = require('../cookieset').xhrAuthenticateCheck;
const createWebSocketServer = require('../websocket');

module.exports = {
    'GET /chat/history': async (ctx, next) => {
        ctx.redirect('/');
    },
    'GET /chat/:id': async (ctx, next) => {
        var chatthemeid = parseInt(ctx.params.id); 
        ctx.redirect('/404');
    },
    'GET /user/chatroom': async (ctx, next) => {
        xhrAuthenticateCheck(ADMIN_CODE)(ctx, next);
        let user = ctx.state.user;
        ctx.render('chat_manage.html', {
            title: '聊天室管理 | 个人博客',
            __admin__:user.admin>5
        });
    },
    'GET /api/chat/chatroom_status_get': async (ctx, next) => {
        xhrAuthenticateCheck(ADMIN_CODE)(ctx, next);
        var chatroomOn = false;
        //console.log('in /api/status_get');
        //console.log(ctx.wss);
        if(ctx.wss){
            //console.log('wss status: '+JSON.stringify(ctx.wss.getServerStatus()));
            chatroomOn = true;
            var {onLineNum, theme} = ctx.wss.getServerStatus();
        }
        ctx.rest({chatroomOn, onLineNum, theme});
    },
    'POST /api/chat/chatroom_manage': async (ctx, next)=>{
        xhrAuthenticateCheck(ADMIN_CODE)(ctx, next);
        var manageAgrs = ctx.request.body;
        //console.log('[chat room status]'+JSON.stringify(manageAgrs));
        var chatroomOn = false;
        var wss = ctx.wss;
        try{
            if(manageAgrs.manage=='on'&&!wss){
                wss = createWebSocketServer(ctx.httpServer);
                wss.setChatroomTheme(manageAgrs.theme);
                ctx.app.context.wss = wss;
                chatroomOn = true;
                var {onLineNum, theme} = ctx.wss.getServerStatus();
            }else if(manageAgrs.manage=='off'&&wss){
                await wss.closeServer();
                ctx.app.context.wss = null;
            } 
        }catch(err){
            console.log(err);
            ctx.rest({success:false});
            return;
        }
        ctx.rest({success:true, chatroomOn, onLineNum, theme});
    },
    'GET /chat/search': async (ctx, next) =>{
        ctx.redirect('/blog/search');
    }
};