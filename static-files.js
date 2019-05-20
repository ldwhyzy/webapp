const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        //console.log('request path: '+rpath);
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if (await fs.exists(fp)) {
                ctx.response.type = mime.lookup(rpath);
                //console.log(`the static index type: ${ctx.response.type}`);
                ctx.response.body = await fs.readFile(fp);
                //console.log(`ctx body: ${ctx.response.body}`);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    };
}

module.exports = staticFiles;