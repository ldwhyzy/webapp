module.exports = {
    'GET /test': async (ctx, next) => {
        ctx.render('test.html', {
            title: '个人博客|技术|杂感'
        });
    }
};