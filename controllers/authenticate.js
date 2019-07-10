//const cryptoJS = require("crypto");
const cookieset = require('../cookieset');

module.exports = {
    'POST /api/authenticate': async (ctx, next) => {
        //var user = ctx.request.body.userName;
        var userinfo = ctx.request.body;
        var username = userinfo.userName;
        var email = userinfo.email;
        const passwd = userinfo.paswd;
        console.log(userinfo);
        if(username){
            //以用户名查询
            
        }else if(email){
            //以邮箱查询
            var username = 'nanashi';
        }
        var userid = 99902; //查询数据库得到

        ctx.state.userid = userid;    //查询用户ID时，都使用该变量
        ctx.state.username = username;    //查询用户ID时，都使用该变量
        
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
        
        (cookieset.cookieSet())(ctx, next);
        //(cookieset.cookieRemove(99110))(ctx, next);
        var access = {access:true, userinfo:{userid:userid, username:username}};
        ctx.rest(access);
    },
    'GET /authenticate/register':  async (ctx, next) => {
        var blog_items = [];
        ctx.render('register.html', {
            title: '注册账号'
        });
    },
    'GET /authenticate/logout':  async (ctx, next) => {
        //var userid = ctx.state.userid;
        //var username = ctx.state.username;
        (cookieset.cookieRemove())(ctx, next);
        
        ctx.render('index.html', {
            title: '个人博客|技术|杂感',
            //studies: blog_items
            //__user__:user
        });

    },
    'POST /authenticate/register':  async (ctx, next) => {
        var user = ctx.request.body.user;
        ctx.render('register.html', {
            title: '注册账号'
        });
    }
}