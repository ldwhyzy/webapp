const nunjucks = require('nunjucks');

function createEnv(path, opts){
    var 
        autoescape = opts.autoescape === undefined?true:opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCacke: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            }
        );
    if (opts.filters){
        for (var f in opts.filters){
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;    
}

function templating(path, opts, app){  //为app.context上下文添加函数，该函数实现nunjucks功能，返回已处理好参数的网页
    var env = createEnv(path, opts);   //path 为HTML文件路径
    app.context.render = function (view, model){
        this.response.body = env.render(view, Object.assign({}, this.state || {}, model || {}));
        this.response.type = 'text/html';
    };
}

module.exports = templating;