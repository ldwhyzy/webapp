const fs = require('fs');

/*从给定的路径下获取.js文件名，
*根据获得的文件名，载入模块，
*解析载入的模块method，path，添加到router，
*返回route给app
*/ 
function addMapping(router, mapping){  //添加路由，mapping是形如'GET /': async (ctx, next){}字典的数组。
    for(var url in mapping){
        if(url.startsWith('GET ')){
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')){
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('DELETE ')){
            var path = url.substring(7);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } 
        else {
            console.log(`invalid URL: ${url}`);
        }
    }    
}

function addControllers(router, dir){//从当前目录的dir目录下，找到所有.js文件
    var files = fs.readdirSync(__dirname + '/' + dir);
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    });

    for(var f of js_files){
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/'+f);    
        addMapping(router, mapping); 
    }    
}

module.exports = function(dir){
    let 
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();    
}