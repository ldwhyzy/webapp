const fs = require('fs');
const path = require('path');
const User = require('../models/User');
module.exports = {
    'GET /user/profile': async (ctx, next) => {
        var userid = ctx.state.user&&ctx.state.user.id;
        if(userid){
             var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息 
             ctx.render("user.html", {userInfo: userInfo, __admin__:ctx.state.user.admin>5});
        }else{
            ctx.response.redirect('/');
        }
    },
    "POST /api/user/getUser": async (ctx, next)=>{
        var userid = ctx.state.user&&ctx.state.user.id;
        if(userid){
            var user = ctx.state.user;
            var result = {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin,
               //portrait: "2.jpg",
                selfInfo: "这是个人简介，想做什么就去做吧。"
            }
            //console.log('/user/api/getuser: '+JSON.stringify(user));
            ctx.rest(result);
        }
    },
    "POST /api/user/info_save": async (ctx, next)=>{
        /*
        ctx.request.body {name, email, selfInfo}
        ctx.request.files {pic}
        */ 
        if(!ctx.state.user)return;
        var pic = ctx.request.files.pic;  //koa-body解析formdata,默认把文件放到os.tmpdir()(\Users\username\AppData\Local\Temp\)
        var updateInfo = ctx.request.body;
        if(updateInfo){
            var result = await User.updateUser(ctx.state.user.id, updateInfo);
        }
        if(pic){
            const reader = fs.createReadStream(pic.path);//manual delete temp upload file needed?!
            let filePath = path.join(__dirname, '../static/images/user_portrait/', `${ctx.state.user.id}`+pic.name);
            const writer = fs.createWriteStream(filePath);
            reader.pipe(writer);
            writer.on("finish", function(){
                fs.unlink(pic.path);
            });
        }
        ctx.rest({success:true,updated:result});      
    },
    'GET /user/message': async (ctx, next) => {
        var user = ctx.state.user
        if(user&&user.admin){
             var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息 
             ctx.render("message.html", {title:'站内私信', __admin__:user.admin>5});
        }else{
            ctx.response.redirect('/');
        }
    },
    'GET /user/manage': async (ctx, next) => {
        var user = ctx.state.user
        if(user&&user.admin){
             var userInfo = {}//
             ctx.render("manage.html", {userInfo: userInfo, __admin__:user.admin>5});
        }else{
            ctx.response.redirect('/');
        }
    },
    'GET /user/space/:id': async (ctx, next) => {
        var user = ctx.state.user;
        try{
            var id = parseInt(ctx.params.id);
            if(!Number.isNaN(id)){
                var userdata = await User.findUserById(id);
                if(user&&userdata&&(user.id==userdata.id)){
                    ctx.response.redirect('/user/profile');
                }else if(userdata){
                    ctx.render("space.html", {userdata:userdata});
                }
            }else{
                ctx.response.redirect('/404');
            }
        }catch(err){
            ctx.response.redirect('/404');
        }
    },
    'POST /api/user/privatemassage': async (ctx, next)=>{
        var user = ctx.state.user;
        if(user){
            var messageData = ctx.request.body;
            var result = await Message.createMessage(messageData);
            if(result)ctx.rest({success:true});
        }
    },
};