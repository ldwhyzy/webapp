module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (app, pathPrefix)=>{
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next)=>{
            if(!app.context.rest && ctx.request.path.startsWith(pathPrefix)){
                console.log('app.context.rest function constructed');
                //*
                app.context.rest = function(data){  
                //function定义的函数，this的指向随着调用环境的变化而变化
                //箭头函数中的this指向是固定不变，一直指向定义函数的环境
                ////该函数写成(data)=>{}形式，第二次调用会出错，暂不知缘由                
                    this.response.type = 'application/json';
                    this.response.body = JSON.stringify(data);
                };
                //*/
                
                /*
                //该函数写成(data)=>{}形式，第二次调用会出错，暂不知缘由
                //疑似再次调用ctx.rest()时，ctx已经改变？？？
                app.context.rest = (data)=>{                  
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                };
                //*/
            try{                
                await next();
            }catch(e){
                      // 返回错误:
                      ctx.response.status = 400;
                      ctx.response.type = 'application/json';
                      ctx.response.body = {
                          code: e.code || 'internal:unknown_error',
                          message: e.message || ''
                    };
            }    
            }else{
                await next();
            }
        };
    }
};