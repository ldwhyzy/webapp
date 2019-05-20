//const cryptoJS = require("crypto");
const cookieset = require('../cookieset');

module.exports = {
    'POST /api/authenticate': async (ctx, next) => {
        var user = ctx.request.body.userName;
        if(user.userName){
            //以用户名查询
        }else if(user.email){
            //以邮箱查询
        }
        var userid = 99902; //查询数据库得到

        ctx.state.userid = userid;    //查询用户ID时，都使用该变量
        
        /*
        cookiesOpt = {
                domain: '127.0.0.1',//写成localhost，在浏览器上以网址http://127.0.0.1:3000/登录不会设置cookie
                path:'/',
                maxAge:7*60*60*24*1000,//毫秒数
                expires:Date.now()+7*60*60*24*1000,
                httpOnly:false,
                overwrite:false
        };
        ctx.cookies.set('userid', userid, cookiesOpt);
        console.log('cookies is seted;');
        //*/
        
        (cookieset.cookieSet(userid))(ctx, next);
        //(cookieset.cookieRemove(99110))(ctx, next);
        
        var access = {access:true, userName:user};
        ctx.rest(access);
    },
    'GET /authenticate/register':  async (ctx, next) => {
        var blog_items = [];
        ctx.render('register.html', {
            title: '注册账号'
        });
    },
    'POST /authenticate/register':  async (ctx, next) => {
        var user = ctx.request.body.user;
        ctx.render('register.html', {
            title: '注册账号'
        });
    }
}