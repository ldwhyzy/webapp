const marked = require('marked');

module.exports = {
    'GET /test': async (ctx, next) => {
        ctx.render('test.html', {
            title: '个人博客|技术|杂感'
        });
    },
    'POST /api/test/md': async(ctx, next)=>{
        var data = ctx.request.body.data;
        console.log(data);
        // var str = (Object.keys(data)).join();
        // console.log(str);
        console.log(marked(data));
        ctx.rest({result: 'got it!'});
    }
};