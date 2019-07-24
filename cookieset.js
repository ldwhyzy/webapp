module.exports = {
    cookieCheck: function (){
         return async (ctx, next)=>{
            var userid = ctx.cookies.get('userid'); 
            var username = ctx.cookies.get('username'); 
            if(userid && username){
                console.log('acessed userid = '+userid+' ,username = '+decodeURIComponent(username));
                //查询数据库是否存在该用户,以验证该cookie是否有效
                //if(!ctx.state.userid)
                //var userid = 'testUser007';
                ctx.state.userid = userid;//
                ctx.state.username = username;//
            }
            else{
                console.log('Cookie is none');
            }
            await next();
        };    
    },

    cookieSet: function (){
        return async (ctx, next)=>{
            //await next();
            if(ctx.state.userid && ctx.state.username){//ctx.state.userid变量已被赋值，而还没有cookie，则创建cookie
                if(!ctx.cookies.get('username')){    
                    cookiesOpt = {
                        domain: '127.0.0.1', //写成localhost，在浏览器上以网址http://127.0.0.1:3000/登录不会设置cookie
                        path:'/',
                        maxAge:7*60*60*24*1000,//毫秒数
                        expires:Date.now()+7*60*60*24*1000,
                        httpOnly:false,
                        overwrite:false
                    };
                    ctx.cookies.set('userid', ctx.state.userid, cookiesOpt);
                    ctx.cookies.set('username', ctx.state.username, cookiesOpt);
                    console.log('cookies is setted;');
                }     
            }
        };
    },

    cookieRemove: function (){ //登出时删除cookie
        return async (ctx, next)=>{
            var userid = ctx.state.userid;
            var username = ctx.state.name;
            //var cookieId = ctx.cookies.get(userid);
            //if(cookieId && (parseInt(cookieId)===userid)){    
            if(userid){    
                cookiesOpt = {
                    domain: '127.0.0.1',
                    path:'/',
                    maxAge:0,//毫秒数
                    //expires:Date.now()+7*60*60*24*1000,
                    httpOnly:false,
                    overwrite:false
                };
                ctx.cookies.set('userid', userid, cookiesOpt);
                ctx.cookies.set('username', username, cookiesOpt);
                ctx.state.userid = null;
                ctx.state.username = null;
                console.log('cookies is removed;');
            }
            //await next(); 
        };
    }
    
    
    
}    