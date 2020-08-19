const Blog = require('../models/Blog');
const Blogtheme = require('../models/Blogtheme');
const Message = require('../models/Message');
const {ADMIN_CODE, COMMAN_CODE} = require('../config');
const {xhrAuthenticateCheck} = require('../cookieset');
const createWebSocketServer = require('../websocket');

function createMessage(message){

}

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
        if(ctx.wss){
            chatroomOn = true;
            var {onLineNum, theme} = ctx.wss.getServerStatus();
        }
        ctx.rest({chatroomOn, onLineNum, theme});
    },
    'POST /api/chat/chatroom_manage': async (ctx, next)=>{
        xhrAuthenticateCheck(ADMIN_CODE)(ctx, next);
        var manageAgrs = ctx.request.body;
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
    },
    'POST /api/space/message': async (ctx, next) =>{
        xhrAuthenticateCheck(COMMAN_CODE)(ctx, next);
        var user = ctx.state.user;
        var {rowCount, currentPage} = ctx.request.body;
        var messages = await Message.offsetFindMessage(rowCount||8, currentPage||1, {message_theme:1, to:user.id});
        ctx.rest({messages});
    },
    'GET /api/space/message/count': async (ctx, next) =>{
        xhrAuthenticateCheck(COMMAN_CODE)(ctx, next);
        var user = ctx.state.user;
        var count = await Message.countAllMessage({message_theme:1, to:user.id});
        ctx.rest({messagesCount:count});
    },
    'GET /api/message/delete/:id': async (ctx, next) =>{
        xhrAuthenticateCheck(COMMAN_CODE)(ctx, next);
        var user = ctx.state.user;
        var id = parseInt(ctx.params.id);
        if(isNaN(id)){
            ctx.rest({result:false});
            return;
        }
        const message = await Message.findMessageById(id);
        if(message&&message.to==user.id)await message.destroy();
        ctx.rest({result:true});
    },
    'POST /api/message/createMessage': async (ctx, next) =>{
        xhrAuthenticateCheck(COMMAN_CODE)(ctx, next);
        var user = ctx.state.user;
        var message = ctx.request.body.message;
        message.from = user.id;
        message.message_theme = 1;
        console.log('[POST /api/message/create]', message);
        const messageIns = await Message.createMessage(message);
        console.log(messageIns.toJSON());
        ctx.rest({result:true});
    }
};