const User = require('../models/User');
module.exports = {
    'GET /user/profile': async (ctx, next) => {
        var userid = ctx.state.user&&ctx.state.user.id;
        if(userid){
             var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息 
             ctx.render("user.html", {userInfo: userInfo, __admin__:ctx.state.user.admin});
        }else{
            ctx.response.redirect('/');
        }
    },
    "POST /api/user/getUser": async (ctx, next)=>{
        var userid = ctx.state.user&&ctx.state.user.id;
        if(userid){
            var user = ctx.state.user;
            var result = {
                name: user.name,
                email: user.email,
                admin: user.admin,
                portrait: "/static/images/user_portrait/2.jpg",
                selfInfo: "这是个人简介，想做什么就去做吧。"
            }
            //console.log('/user/api/getuser: '+JSON.stringify(user));
            ctx.rest(result);
        }
    },
    "POST /api/user/info_save": async (ctx, next)=>{
        name = ctx.request.body.name+"re";
        email = ctx.request.body.email+"re";
        portrait = ctx.request.body.portrait;
        selfInfo = ctx.request.body.selfInfo+"re";
        ctx.rest({name: name, email: email, portrait: portrait, selfInfo: selfInfo});
    },
    'GET /user/manage': async (ctx, next) => {
        var user = ctx.state.user
        if(user&&user.admin){
             var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息 
             ctx.render("manage.html", {userInfo: userInfo, __admin__:user.admin});
        }else{
            ctx.response.redirect('/');
        }
    },
};