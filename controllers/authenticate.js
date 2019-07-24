//const cryptoJS = require("crypto-js");
const cookieset = require('../cookieset');
const User = require('../models/User');

module.exports = {
    'POST /api/authenticate/login': async (ctx, next) => {
        //var user = ctx.request.body.userName;
        var userinfo = ctx.request.body;
        var name = userinfo.name||'admin@personalblog.com';
        var email = userinfo.email||'admin';
        const passwd = userinfo.passwd;
        const user = {name:name, email:email, passwd:passwd};
        console.log('login user: '+JSON.stringify(user));
        var usercheck = await User.userExist(user);
        var result = {result:null};
        if(!usercheck.user){
            result.result = 'User Not Exist';
        }else if(passwd!=usercheck.user.passwd){
            result.result = 'Password Error';
        }else{
            ctx.state.userid = usercheck.user.id;    
            ctx.state.username = encodeURIComponent(usercheck.user.name);
            await (cookieset.cookieSet())(ctx, next);
            result.result = 'Success';   
        }        
        ctx.rest(result);
    },
    'GET /authenticate/register':  async (ctx, next) => {
        ctx.render('register.html', {
            title: '注册账号'
        });
    },
    'POST /api/authenticate/register': async (ctx, next) => {
        var userinfo = ctx.request.body;
        var returnInfo = {};
        //var username = userinfo.name;
        //var email = userinfo.email;
        //var passwd = userinfo.passwd;
        var exist = (await User.userExist(userinfo)).checkInfo;
        if(!exist.nameE && !exist.emailE){
            //userinfo.passwd = cryptoJS.SHA1('userinfo.passwd').toString(cryptoJS.enc.Hex);
            //console.log('useinfo passwd'+ userinfo.passwd); 
            let user = await User.createUser(userinfo);
            ctx.state.userid = user.id;
            ctx.state.username = encodeURIComponent(user.name);
            await (cookieset.cookieSet())(ctx, next);
            returnInfo.info = "success";
        }
        else{
            returnInfo.info = (exist.emailE && "duplicate-email") || (exist.nameE && "duplicate-name");
        }
        //console.log('POST /api/authenticate/register: ' + JSON.stringify(returnInfo)); 
        ctx.rest(returnInfo);
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