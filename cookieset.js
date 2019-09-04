const User = require('./models/User');
const crypto = require('./utils/crypto');

module.exports = {
    cookieCheck: function (){
         return async (ctx, next)=>{
            var userid = ctx.cookies.get('userid'); 
            var username = ctx.cookies.get('username');
            var aid = ctx.cookies.get('aid');
            var checkResult = 'Cookie is none'; 
            ctx.state.user = null;
            if(userid && username && aid){
                //查询数据库是否存在该用户,以验证该cookie是否有效
                let userFind = {name:decodeURIComponent(username), email:null};
                if(crypto.decrypt(aid)==(''+userid+username)){
                    var result = await User.userExist(userFind);
                    if(result.checkInfo.nameE && result.user.id==parseInt(userid)){
                        ctx.state.user = result.user.get({plain:true});
                        checkResult = 'acessed userid = '+userid+' ,username = '+decodeURIComponent(username);
                    }
                }
            }
            console.log(checkResult);
            await next();
        };    
    },

    cookieSet: function (){
        return async (ctx, next)=>{
            //await next();
            if(ctx.state.user){//ctx.state.userid变量已被赋值，而还没有cookie，则创建cookie
                if(!ctx.cookies.get('username')){    
                    cookiesOpt = {
                        domain: '127.0.0.1', //写成localhost，在浏览器上以网址http://127.0.0.1:3000/登录不会设置cookie
                        path:'/',
                        maxAge:7*60*60*24*1000,//毫秒数
                        expires:Date.now()+7*60*60*24*1000,
                        httpOnly:false,
                        overwrite:false
                    };
                    let aid = crypto.encrypt(''+ctx.state.user.id + encodeURIComponent(ctx.state.user.name));
                    ctx.cookies.set('userid', ctx.state.user.id, cookiesOpt);
                    ctx.cookies.set('username', encodeURIComponent(ctx.state.user.name), cookiesOpt);
                    ctx.cookies.set('aid', aid, cookiesOpt);
                    console.log('cookies is setted;');
                }     
            }
        };
    },

    cookieRemove: function (){ //登出时删除cookie
        return async (ctx, next)=>{  
                cookiesOpt = {
                    domain: '127.0.0.1',
                    path:'/',
                    maxAge:0,//毫秒数
                    //expires:Date.now()+7*60*60*24*1000,
                    httpOnly:false,
                    overwrite:false
                };
                ctx.cookies.set('userid', 0, cookiesOpt);
                ctx.cookies.set('username', null, cookiesOpt);
                ctx.cookies.set('aid', null, cookiesOpt);
                ctx.state.user = null;
                ctx.state.aid = null;
                console.log('cookies is removed;'); 
        };
    }
}    