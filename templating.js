const nunjucks = require('nunjucks');
const {getPublishTime, markdownToHTML} = require('./utils/tools');

filters = {getPublishTime, markdownToHTML};

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

function templating(path, opts, app){  //app.context
    opts.filters = filters;
    var env = createEnv(path, opts);   //path of .HTML files
    app.context.render = function (view, model){
        this.response.body = env.render(view, Object.assign({}, this.state || {}, model || {}));
        this.response.type = 'text/html';
    };
}

module.exports = templating;