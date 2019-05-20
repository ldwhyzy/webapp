module.exports = {
    cookieCheck: function (){
         return async (ctx, next)=>{
            var userid = ctx.cookies.get('userid'); 
            if(userid){
                console.log('acessed userid = '+userid);
                //查询数据库是否存在该用户,以验证该cookie是否有效
                //if(!ctx.state.userid)
                //var userid = 'testUser007';
                ctx.state.userid = userid;//
            }
            else{
                console.log('Cookie is none');
            }
            await next();
        };    
    },
    /*
    cookieSet: function (userid){
        return async (ctx, next)=>{
            cookiesOpt = {
                domain: 'localhost',
                path:'/',
                maxAge:7*60*60*24*1000,//毫秒数
                expires:Date.now()+7*60*60*24*1000,
                httpOnly:false,
                overwrite:false
            };
            ctx.cookies.set('userid', userid, cookiesOpt);
            ctx.state.userid = userid;
            console.log('cookies is seted;');
            await next();
        };
    }*/
    cookieSet: function (userid){
        return async (ctx, next)=>{
            await next();
            //if(ctx.state.userid){//ctx.state.userid变量已被赋值，而还没有cookie，则创建cookie
                if(!ctx.cookies.get('userid')){    
                    cookiesOpt = {
                        domain: '127.0.0.1', //写成localhost，在浏览器上以网址http://127.0.0.1:3000/登录不会设置cookie
                        path:'/',
                        maxAge:7*60*60*24*1000,//毫秒数
                        expires:Date.now()+7*60*60*24*1000,
                        httpOnly:false,
                        overwrite:false
                    };
                    ctx.cookies.set('userid', userid, cookiesOpt);
                    console.log('cookies is seted;');
                }
            //}               
        };
    },
    cookieRemove: function (userid){ //登出时删除cookie
        return async (ctx, next)=>{
            var cookieId = ctx.cookies.get('userid');
            if(cookieId && (parseInt(cookieId)===userid)){    
                cookiesOpt = {
                    domain: '127.0.0.1',
                    path:'/',
                    maxAge:0,//毫秒数
                    //expires:Date.now()+7*60*60*24*1000,
                    httpOnly:false,
                    overwrite:false
                };
                ctx.cookies.set('userid', userid, cookiesOpt);
                ctx.state.userid = null;
                console.log('cookies is removed;');
            }
            //await next(); 
        };
    }
    
    
    
}    