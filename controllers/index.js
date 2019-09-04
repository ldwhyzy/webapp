module.exports = {
    'GET /': async (ctx, next) => {
        var blog_items = [];
        var user = null;
        ctx.render('index.html', {
            title: '个人博客|技术|杂感',
            //studies: blog_items
            //__user__:user
        });
    },
    
    'GET /404': async (ctx, next) => {
        ctx.render('404.html', {
            title: '未找到相关页面',
        });
    }
};